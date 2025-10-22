import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export interface DLQJobData {
  originalQueue: string;
  jobId: string;
  jobData: any;
  failedReason: string;
  failedAt: Date;
  retryCount: number;
}

@Injectable()
export class DLQService {
  private readonly logger = new Logger(DLQService.name);

  constructor(
    @InjectQueue('notifications-dlq') private notificationsDlq: Queue,
    @InjectQueue('emails-dlq') private emailsDlq: Queue,
    @InjectQueue('orders-dlq') private ordersDlq: Queue,
    @InjectQueue('webhooks-dlq') private webhooksDlq: Queue,
    @InjectModel('DLQJob') private dlqJobModel: Model<any>,
  ) {}

  /**
   * Move failed job to DLQ
   */
  async moveToDLQ(queueName: string, job: Job, error: Error): Promise<void> {
    try {
      const dlqQueue = this.getDLQQueue(queueName);
      if (!dlqQueue) {
        this.logger.warn(`No DLQ configured for queue: ${queueName}`);
        return;
      }

      const dlqData: DLQJobData = {
        originalQueue: queueName,
        jobId: job.id,
        jobData: job.data,
        failedReason: error.message,
        failedAt: new Date(),
        retryCount: job.attemptsMade,
      };

      // Store in database for tracking
      await this.dlqJobModel.create(dlqData);

      // Move to DLQ queue
      await dlqQueue.add(
        `dlq-${queueName}-${job.id}`,
        dlqData,
        {
          attempts: 1, // DLQ jobs don't retry
          removeOnComplete: false,
          removeOnFail: false,
        }
      );

      this.logger.log(`Job ${job.id} from ${queueName} moved to DLQ: ${error.message}`);

      // Send alert for manual review
      await this.sendDLQAlert(dlqData);

    } catch (dlqError) {
      this.logger.error(`Failed to move job ${job.id} to DLQ: ${dlqError.message}`);
    }
  }

  /**
   * Retry jobs from DLQ
   */
  async retryFromDLQ(queueName: string, jobId?: string, limit: number = 10): Promise<number> {
    try {
      const dlqQueue = this.getDLQQueue(queueName);
      if (!dlqQueue) {
        throw new Error(`No DLQ configured for queue: ${queueName}`);
      }

      const originalQueue = this.getOriginalQueue(queueName);
      if (!originalQueue) {
        throw new Error(`No original queue found for DLQ: ${queueName}`);
      }

      // Get failed jobs from DLQ
      const dlqJobs = await dlqQueue.getJobs(['failed'], 0, limit);

      let retryCount = 0;

      for (const dlqJob of dlqJobs) {
        if (jobId && dlqJob.id !== jobId) continue;

        try {
          const jobData = dlqJob.data as DLQJobData;

          // Re-queue to original queue with higher priority
          await originalQueue.add(
            `retry-${dlqJob.id}`,
            jobData.jobData,
            {
              priority: 10, // Higher priority for retries
              attempts: Math.max(jobData.retryCount - 1, 1), // Reduce attempts
              backoff: {
                type: 'exponential',
                delay: 5000, // Longer initial delay
              },
              removeOnComplete: 50,
              removeOnFail: false,
            }
          );

          // Mark DLQ job as completed
          await dlqJob.moveToCompleted('Retried successfully', true);

          // Update database record
          await this.dlqJobModel.updateOne(
            { jobId: dlqJob.id },
            {
              status: 'retried',
              retriedAt: new Date(),
            }
          );

          retryCount++;
          this.logger.log(`Retried job ${dlqJob.id} from DLQ ${queueName}`);

        } catch (retryError) {
          this.logger.error(`Failed to retry job ${dlqJob.id}: ${retryError.message}`);
        }
      }

      return retryCount;

    } catch (error) {
      this.logger.error(`DLQ retry failed for ${queueName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get DLQ statistics
   */
  async getDLQStats(): Promise<any> {
    const stats = {
      notifications: await this.getQueueStats('notifications-dlq'),
      emails: await this.getQueueStats('emails-dlq'),
      orders: await this.getQueueStats('orders-dlq'),
      webhooks: await this.getQueueStats('webhooks-dlq'),
    };

    // Add summary
    stats.summary = {
      totalFailed: Object.values(stats).reduce((sum, queueStats: any) =>
        sum + (queueStats?.failed || 0), 0),
      oldestFailed: Object.values(stats).reduce((oldest, queueStats: any) => {
        if (!queueStats?.oldestFailed) return oldest;
        return !oldest || queueStats.oldestFailed < oldest ? queueStats.oldestFailed : oldest;
      }, null),
    };

    return stats;
  }

  /**
   * Clean up old DLQ jobs
   */
  async cleanupOldDLQJobs(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    try {
      // Clean up from all DLQs
      const queues = ['notifications-dlq', 'emails-dlq', 'orders-dlq', 'webhooks-dlq'];
      let totalCleaned = 0;

      for (const queueName of queues) {
        const dlqQueue = this.getDLQQueue(queueName);
        if (dlqQueue) {
          const cleaned = await this.cleanupQueue(dlqQueue, cutoffDate);
          totalCleaned += cleaned;
        }
      }

      // Clean up database records
      const dbCleaned = await this.dlqJobModel.deleteMany({
        failedAt: { $lt: cutoffDate }
      });

      this.logger.log(`Cleaned up ${totalCleaned} DLQ jobs and ${dbCleaned.deletedCount} database records older than ${daysOld} days`);

      return totalCleaned + dbCleaned.deletedCount;

    } catch (error) {
      this.logger.error(`DLQ cleanup failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  private async getQueueStats(queueName: string): Promise<any> {
    try {
      const queue = this.getDLQQueue(queueName);
      if (!queue) return null;

      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
      ]);

      const oldestFailed = failed.length > 0 ?
        failed.reduce((oldest, job) => job.finishedOn < oldest.finishedOn ? job : oldest) : null;

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        oldestFailed: oldestFailed?.finishedOn || null,
      };

    } catch (error) {
      this.logger.error(`Failed to get stats for ${queueName}: ${error.message}`);
      return null;
    }
  }

  /**
   * Clean up old jobs from a specific queue
   */
  private async cleanupQueue(queue: Queue, cutoffDate: Date): Promise<number> {
    try {
      const completedJobs = await queue.getCompleted(0, 100);
      const failedJobs = await queue.getFailed(0, 100);

      let cleaned = 0;

      for (const job of [...completedJobs, ...failedJobs]) {
        if (job.finishedOn && job.finishedOn < cutoffDate.getTime()) {
          await job.remove();
          cleaned++;
        }
      }

      return cleaned;

    } catch (error) {
      this.logger.error(`Failed to cleanup queue ${queue.name}: ${error.message}`);
      return 0;
    }
  }

  /**
   * Get DLQ queue by name
   */
  private getDLQQueue(queueName: string): Queue | null {
    switch (queueName) {
      case 'notifications-dlq': return this.notificationsDlq;
      case 'emails-dlq': return this.emailsDlq;
      case 'orders-dlq': return this.ordersDlq;
      case 'webhooks-dlq': return this.webhooksDlq;
      default: return null;
    }
  }

  /**
   * Get original queue for DLQ
   */
  private getOriginalQueue(dlqName: string): Queue | null {
    // This would need to be injected or configured
    // For now, return null - would need to inject all original queues
    return null;
  }

  /**
   * Send alert for DLQ job
   */
  private async sendDLQAlert(dlqData: DLQJobData): Promise<void> {
    // Implement alert notification (email, Slack, etc.)
    this.logger.warn(`DLQ Alert: Job ${dlqData.jobId} from ${dlqData.originalQueue} failed: ${dlqData.failedReason}`);

    // TODO: Integrate with notification system
    // await this.notificationService.sendAlert({
    //   title: 'DLQ Job Alert',
    //   message: `Job ${dlqData.jobId} moved to ${dlqData.originalQueue} DLQ`,
    //   severity: 'high',
    //   data: dlqData
    // });
  }
}
