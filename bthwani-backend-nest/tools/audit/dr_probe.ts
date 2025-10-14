#!/usr/bin/env ts-node
/**
 * Disaster Recovery & Backup Readiness Probe
 * 
 * Searches for:
 * - Backup strategies and configurations
 * - Recovery procedures and runbooks
 * - SLIs/SLAs/SLOs
 * - Database backup settings
 * - Disaster recovery documentation
 * 
 * Generates: reports/dr_readiness.md with RPO/RTO analysis
 */

import * as fs from 'fs';
import * as path from 'path';

interface BackupConfig {
  service: string;
  configured: boolean;
  strategy?: string;
  location?: string;
  frequency?: string;
  retention?: string;
  notes: string;
}

interface RunbookStatus {
  name: string;
  found: boolean;
  location?: string;
  coverage: string[];
}

interface SLIStatus {
  metric: string;
  defined: boolean;
  target?: string;
  location?: string;
}

interface DRComponent {
  component: string;
  rto: string;
  rpo: string;
  backupStrategy: string;
  recoveryProcedure: string;
  status: 'ready' | 'partial' | 'missing';
}

class DRProbeAuditor {
  private reportsPath: string;
  private configPath: string;
  private backupConfigs: BackupConfig[] = [];
  private runbooks: RunbookStatus[] = [];
  private slis: SLIStatus[] = [];
  private drComponents: DRComponent[] = [];

  constructor() {
    this.reportsPath = path.join(process.cwd(), 'reports');
    this.configPath = path.join(process.cwd(), 'src', 'config');
  }

  async audit(): Promise<void> {
    console.log('🔍 Starting Disaster Recovery & Backup Probe...\n');

    // 1. Check backup configurations
    this.checkBackupConfigs();

    // 2. Search for runbooks
    this.searchRunbooks();

    // 3. Check SLIs/SLAs
    this.checkSLIs();

    // 4. Analyze DR components
    this.analyzeDRComponents();

    console.log('\n✅ Analysis complete!\n');

    // 5. Generate report
    this.generateReport();

    console.log('✨ Audit complete!\n');
  }

  /**
   * Check backup configurations
   */
  private checkBackupConfigs(): void {
    console.log('📦 Checking backup configurations...');

    // Check database config
    this.checkDatabaseBackup();

    // Check docker-compose volumes
    this.checkDockerBackup();

    // Check Redis persistence
    this.checkRedisBackup();

    // Check file uploads backup
    this.checkFileBackup();

    console.log(`  ✓ Found ${this.backupConfigs.length} backup configurations\n`);
  }

  /**
   * Check database backup configuration
   */
  private checkDatabaseBackup(): void {
    const dbConfigPath = path.join(this.configPath, 'database.config.ts');

    if (fs.existsSync(dbConfigPath)) {
      const content = fs.readFileSync(dbConfigPath, 'utf-8');

      const hasRetryWrites = content.includes('retryWrites: true');
      const hasWriteConcern = content.includes("w: 'majority'");

      this.backupConfigs.push({
        service: 'MongoDB',
        configured: hasRetryWrites && hasWriteConcern,
        strategy: hasWriteConcern ? 'Replica Set with majority write concern' : 'Single instance',
        location: dbConfigPath,
        frequency: '[TBD]',
        retention: '[TBD]',
        notes: hasRetryWrites && hasWriteConcern 
          ? 'Good write durability settings, but automated backup not detected'
          : 'Missing replica set configuration for high availability',
      });
    } else {
      this.backupConfigs.push({
        service: 'MongoDB',
        configured: false,
        notes: 'Database config file not found',
      });
    }
  }

  /**
   * Check Docker volumes backup
   */
  private checkDockerBackup(): void {
    const dockerComposePath = path.join(process.cwd(), 'docker-compose.yml');

    if (fs.existsSync(dockerComposePath)) {
      const content = fs.readFileSync(dockerComposePath, 'utf-8');

      const hasMongoVolume = content.includes('mongo-data');
      const hasRedisVolume = content.includes('redis-data');

      this.backupConfigs.push({
        service: 'Docker Volumes',
        configured: hasMongoVolume && hasRedisVolume,
        strategy: 'Named volumes (persistent)',
        location: dockerComposePath,
        frequency: '[TBD]',
        retention: '[TBD]',
        notes: hasMongoVolume && hasRedisVolume
          ? 'Volumes configured but backup automation not detected'
          : 'Missing volume configuration',
      });
    }
  }

  /**
   * Check Redis persistence
   */
  private checkRedisBackup(): void {
    const dockerComposePath = path.join(process.cwd(), 'docker-compose.yml');

    if (fs.existsSync(dockerComposePath)) {
      const content = fs.readFileSync(dockerComposePath, 'utf-8');

      const hasAppendOnly = content.includes('appendonly yes');
      const hasVolume = content.includes('redis-data');

      this.backupConfigs.push({
        service: 'Redis',
        configured: hasAppendOnly && hasVolume,
        strategy: hasAppendOnly ? 'AOF (Append Only File)' : 'RDB snapshots',
        location: dockerComposePath,
        frequency: hasAppendOnly ? 'Every write' : '[TBD]',
        retention: '[TBD]',
        notes: hasAppendOnly
          ? 'AOF enabled for durability, but backup automation not detected'
          : 'Consider enabling AOF for better durability',
      });
    }
  }

  /**
   * Check file uploads backup
   */
  private checkFileBackup(): void {
    const dockerComposePath = path.join(process.cwd(), 'docker-compose.yml');

    if (fs.existsSync(dockerComposePath)) {
      const content = fs.readFileSync(dockerComposePath, 'utf-8');

      const hasUploadsVolume = content.includes('./uploads');

      this.backupConfigs.push({
        service: 'File Uploads',
        configured: hasUploadsVolume,
        strategy: hasUploadsVolume ? 'Host directory mount' : 'Not configured',
        location: dockerComposePath,
        frequency: '[TBD]',
        retention: '[TBD]',
        notes: hasUploadsVolume
          ? 'Mounted to host, needs external backup solution'
          : 'No file upload storage configured',
      });
    }
  }

  /**
   * Search for runbooks and DR documentation
   */
  private searchRunbooks(): void {
    console.log('📚 Searching for runbooks and DR documentation...');

    const runbookTypes = [
      { name: 'Disaster Recovery Runbook', patterns: ['DR', 'disaster', 'recovery', 'failover'] },
      { name: 'Backup & Restore Runbook', patterns: ['backup', 'restore', 'recovery'] },
      { name: 'Incident Response Plan', patterns: ['incident', 'response', 'escalation'] },
      { name: 'Database Recovery Procedure', patterns: ['database', 'mongo', 'restore'] },
      { name: 'Service Degradation Runbook', patterns: ['degradation', 'fallback'] },
    ];

    for (const runbookType of runbookTypes) {
      const found = this.searchForRunbook(runbookType.patterns);
      this.runbooks.push({
        name: runbookType.name,
        found: found.found,
        location: found.location,
        coverage: found.coverage,
      });
    }

    console.log(`  ✓ Found ${this.runbooks.filter(r => r.found).length}/${this.runbooks.length} runbooks\n`);
  }

  /**
   * Search for runbook in reports
   */
  private searchForRunbook(patterns: string[]): { found: boolean; location?: string; coverage: string[] } {
    if (!fs.existsSync(this.reportsPath)) {
      return { found: false, coverage: [] };
    }

    const files = fs.readdirSync(this.reportsPath);
    const coverage: string[] = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(this.reportsPath, file);
      const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();

      for (const pattern of patterns) {
        if (content.includes(pattern.toLowerCase())) {
          coverage.push(file);
          break;
        }
      }
    }

    return {
      found: coverage.length > 0,
      location: coverage.length > 0 ? `reports/${coverage[0]}` : undefined,
      coverage,
    };
  }

  /**
   * Check for SLIs/SLAs/SLOs
   */
  private checkSLIs(): void {
    console.log('📊 Checking SLIs/SLAs/SLOs...');

    const sliTypes = [
      { metric: 'Uptime/Availability SLI', patterns: ['uptime', 'availability', 'sli'] },
      { metric: 'Response Time SLI', patterns: ['response time', 'latency', 'p99'] },
      { metric: 'Error Rate SLI', patterns: ['error rate', 'success rate'] },
      { metric: 'Data Durability SLI', patterns: ['durability', 'data loss'] },
      { metric: 'Recovery Time Objective (RTO)', patterns: ['rto', 'recovery time'] },
      { metric: 'Recovery Point Objective (RPO)', patterns: ['rpo', 'recovery point'] },
    ];

    for (const sliType of sliTypes) {
      const found = this.searchForSLI(sliType.patterns);
      this.slis.push({
        metric: sliType.metric,
        defined: found.found,
        target: found.target,
        location: found.location,
      });
    }

    console.log(`  ✓ Found ${this.slis.filter(s => s.defined).length}/${this.slis.length} SLI definitions\n`);
  }

  /**
   * Search for SLI definitions
   */
  private searchForSLI(patterns: string[]): { found: boolean; target?: string; location?: string } {
    if (!fs.existsSync(this.reportsPath)) {
      return { found: false };
    }

    const files = fs.readdirSync(this.reportsPath);

    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.json')) continue;

      const filePath = path.join(this.reportsPath, file);
      const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();

      for (const pattern of patterns) {
        if (content.includes(pattern.toLowerCase())) {
          return {
            found: true,
            target: '[TBD]',
            location: `reports/${file}`,
          };
        }
      }
    }

    return { found: false };
  }

  /**
   * Analyze DR components
   */
  private analyzeDRComponents(): void {
    console.log('🔧 Analyzing DR components...');

    this.drComponents = [
      {
        component: 'MongoDB Database',
        rto: '[TBD]',
        rpo: '[TBD]',
        backupStrategy: this.getBackupStrategy('MongoDB'),
        recoveryProcedure: this.hasRunbook('Database Recovery') ? 'Documented' : '[TBD]',
        status: this.getComponentStatus('MongoDB'),
      },
      {
        component: 'Redis Cache',
        rto: '[TBD]',
        rpo: '[TBD]',
        backupStrategy: this.getBackupStrategy('Redis'),
        recoveryProcedure: '[TBD]',
        status: this.getComponentStatus('Redis'),
      },
      {
        component: 'Application Service',
        rto: '[TBD]',
        rpo: 'N/A (Stateless)',
        backupStrategy: 'Container images + Git repository',
        recoveryProcedure: '[TBD]',
        status: 'partial',
      },
      {
        component: 'File Storage',
        rto: '[TBD]',
        rpo: '[TBD]',
        backupStrategy: this.getBackupStrategy('File Uploads'),
        recoveryProcedure: '[TBD]',
        status: this.getComponentStatus('File Uploads'),
      },
      {
        component: 'Configuration & Secrets',
        rto: '[TBD]',
        rpo: 'N/A',
        backupStrategy: 'Environment variables + Git',
        recoveryProcedure: '[TBD]',
        status: 'partial',
      },
    ];

    console.log(`  ✓ Analyzed ${this.drComponents.length} DR components\n`);
  }

  /**
   * Get backup strategy for service
   */
  private getBackupStrategy(service: string): string {
    const backup = this.backupConfigs.find(b => b.service === service);
    return backup?.strategy || '[TBD]';
  }

  /**
   * Check if runbook exists
   */
  private hasRunbook(name: string): boolean {
    return this.runbooks.some(r => r.name.includes(name) && r.found);
  }

  /**
   * Get component DR status
   */
  private getComponentStatus(service: string): 'ready' | 'partial' | 'missing' {
    const backup = this.backupConfigs.find(b => b.service === service);
    
    if (!backup || !backup.configured) {
      return 'missing';
    }

    if (backup.frequency === '[TBD]' || backup.retention === '[TBD]') {
      return 'partial';
    }

    return 'ready';
  }

  /**
   * Generate report
   */
  private generateReport(): void {
    const reportPath = path.join(this.reportsPath, 'dr_readiness.md');

    if (!fs.existsSync(this.reportsPath)) {
      fs.mkdirSync(this.reportsPath, { recursive: true });
    }

    let content = '# تقرير جاهزية Disaster Recovery\n\n';
    content += `**التاريخ**: ${new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}\n`;
    content += `**الوقت**: ${new Date().toLocaleTimeString('ar-EG')}\n\n`;
    content += '**الهدف**: تقييم جاهزية النظام للتعافي من الكوارث والنسخ الاحتياطية\n\n';
    content += '---\n\n';

    // Executive Summary
    content += '## 📊 الملخص التنفيذي\n\n';

    const readyComponents = this.drComponents.filter(c => c.status === 'ready').length;
    const partialComponents = this.drComponents.filter(c => c.status === 'partial').length;
    const missingComponents = this.drComponents.filter(c => c.status === 'missing').length;

    const readyPercent = Math.round((readyComponents / this.drComponents.length) * 100);

    content += `- **المكونات الجاهزة**: ${readyComponents}/${this.drComponents.length}\n`;
    content += `- **المكونات الجزئية**: ${partialComponents}/${this.drComponents.length}\n`;
    content += `- **المكونات المفقودة**: ${missingComponents}/${this.drComponents.length}\n`;
    content += `- **Runbooks الموثّقة**: ${this.runbooks.filter(r => r.found).length}/${this.runbooks.length}\n`;
    content += `- **SLIs المُعرّفة**: ${this.slis.filter(s => s.defined).length}/${this.slis.length}\n\n`;

    content += this.generateProgressBar('جاهزية DR', readyPercent);
    content += '\n';

    // RTO/RPO Summary
    content += '## ⏱️ أهداف التعافي (RTO/RPO)\n\n';
    content += '> **ملاحظة**: القيم الحالية [TBD] تحتاج تحديد بناءً على متطلبات العمل\n\n';

    content += '| المكون | RTO | RPO | الحالة |\n';
    content += '|--------|-----|-----|--------|\n';

    for (const component of this.drComponents) {
      const statusEmoji = {
        ready: '✅',
        partial: '⚠️',
        missing: '❌',
      }[component.status];

      content += `| ${component.component} | ${component.rto} | ${component.rpo} | ${statusEmoji} |\n`;
    }
    content += '\n';

    content += '**التعريفات**:\n';
    content += '- **RTO (Recovery Time Objective)**: أقصى وقت توقف مقبول للخدمة\n';
    content += '- **RPO (Recovery Point Objective)**: أقصى فترة فقد بيانات مقبولة\n\n';

    // Backup Configurations
    content += '## 💾 إعدادات النسخ الاحتياطي\n\n';

    content += '| الخدمة | الحالة | الاستراتيجية | التكرار | الاحتفاظ | ملاحظات |\n';
    content += '|--------|--------|--------------|----------|----------|----------|\n';

    for (const backup of this.backupConfigs) {
      const status = backup.configured ? '✅' : '❌';
      content += `| ${backup.service} | ${status} | ${backup.strategy || '-'} | `;
      content += `${backup.frequency || '-'} | ${backup.retention || '-'} | `;
      content += `${backup.notes} |\n`;
    }
    content += '\n';

    // Runbooks Status
    content += '## 📚 Runbooks ووثائق DR\n\n';

    content += '| Runbook | الحالة | الموقع |\n';
    content += '|---------|--------|--------|\n';

    for (const runbook of this.runbooks) {
      const status = runbook.found ? '✅' : '❌';
      content += `| ${runbook.name} | ${status} | ${runbook.location || '-'} |\n`;
    }
    content += '\n';

    if (this.runbooks.some(r => !r.found)) {
      content += '**المفقود**: يُنصح بإنشاء Runbooks للعمليات التالية:\n';
      for (const runbook of this.runbooks.filter(r => !r.found)) {
        content += `- ${runbook.name}\n`;
      }
      content += '\n';
    }

    // SLIs/SLAs Status
    content += '## 📈 SLIs/SLAs/SLOs\n\n';

    content += '| المقياس | محدد | الهدف | الموقع |\n';
    content += '|---------|------|--------|--------|\n';

    for (const sli of this.slis) {
      const status = sli.defined ? '✅' : '❌';
      content += `| ${sli.metric} | ${status} | ${sli.target || '-'} | ${sli.location || '-'} |\n`;
    }
    content += '\n';

    // Detailed Component Analysis
    content += '## 🔧 تحليل تفصيلي للمكونات\n\n';

    for (const component of this.drComponents) {
      const statusEmoji = {
        ready: '✅',
        partial: '⚠️',
        missing: '❌',
      }[component.status];

      content += `### ${statusEmoji} ${component.component}\n\n`;
      content += `- **RTO**: ${component.rto}\n`;
      content += `- **RPO**: ${component.rpo}\n`;
      content += `- **استراتيجية النسخ الاحتياطي**: ${component.backupStrategy}\n`;
      content += `- **إجراء الاسترجاع**: ${component.recoveryProcedure}\n`;
      content += `- **الحالة**: ${component.status}\n\n`;
    }

    // Gap Analysis
    content += '## ⚠️ الفجوات المكتشفة\n\n';

    const gaps: string[] = [];

    // Backup gaps
    const missingBackups = this.backupConfigs.filter(b => !b.configured);
    if (missingBackups.length > 0) {
      gaps.push(`**نسخ احتياطية مفقودة**: ${missingBackups.map(b => b.service).join(', ')}`);
    }

    // Runbook gaps
    const missingRunbooks = this.runbooks.filter(r => !r.found);
    if (missingRunbooks.length > 0) {
      gaps.push(`**Runbooks مفقودة**: ${missingRunbooks.length} من ${this.runbooks.length}`);
    }

    // SLI gaps
    const missingSLIs = this.slis.filter(s => !s.defined);
    if (missingSLIs.length > 0) {
      gaps.push(`**SLIs غير محددة**: ${missingSLIs.length} من ${this.slis.length}`);
    }

    // TBD values
    const tbdCount = this.drComponents.filter(c => 
      c.rto === '[TBD]' || c.rpo === '[TBD]' || c.recoveryProcedure === '[TBD]'
    ).length;
    if (tbdCount > 0) {
      gaps.push(`**قيم غير محددة (TBD)**: ${tbdCount} مكون يحتاج تحديد RTO/RPO/Recovery`);
    }

    if (gaps.length === 0) {
      content += '_لا توجد فجوات! جميع المتطلبات مُنفذة._ 🎉\n\n';
    } else {
      for (let i = 0; i < gaps.length; i++) {
        content += `${i + 1}. ${gaps[i]}\n`;
      }
      content += '\n';
    }

    // Recommendations
    content += '## 💡 التوصيات\n\n';

    content += '### 1. نسخ احتياطية تلقائية\n\n';
    content += '**الأولوية**: حرجة\n\n';
    content += '```bash\n';
    content += '# مثال: MongoDB backup script\n';
    content += 'mongodump --uri="$MONGODB_URI" --out=/backup/$(date +%Y%m%d)\n';
    content += '# Schedule with cron: 0 2 * * * /path/to/backup.sh\n';
    content += '```\n\n';

    content += '**التوصيات**:\n';
    content += '- إعداد نسخ احتياطية يومية لقاعدة البيانات\n';
    content += '- تخزين النسخ في موقع منفصل (S3, cloud storage)\n';
    content += '- اختبار استرجاع النسخ شهرياً\n';
    content += '- الاحتفاظ بالنسخ لمدة 30 يوم على الأقل\n\n';

    content += '### 2. تحديد RTO/RPO\n\n';
    content += '**الأولوية**: عالية\n\n';
    content += 'يجب تحديد قيم RTO/RPO بناءً على:\n';
    content += '- تأثير توقف الخدمة على العمل\n';
    content += '- تكلفة فقد البيانات\n';
    content += '- ميزانية البنية التحتية\n\n';

    content += '**مثال قيم معقولة**:\n';
    content += '- MongoDB: RTO=1 hour, RPO=15 minutes\n';
    content += '- Redis: RTO=5 minutes, RPO=1 minute\n';
    content += '- Application: RTO=10 minutes, RPO=N/A\n\n';

    content += '### 3. Runbooks والوثائق\n\n';
    content += '**الأولوية**: عالية\n\n';
    content += 'إنشاء Runbooks للعمليات التالية:\n';
    for (const runbook of this.runbooks.filter(r => !r.found)) {
      content += `- [ ] ${runbook.name}\n`;
    }
    content += '\n';

    content += '**محتوى Runbook يجب أن يتضمن**:\n';
    content += '1. خطوات واضحة ومرقمة\n';
    content += '2. الأوامر الدقيقة للتنفيذ\n';
    content += '3. نقاط التحقق والتأكد\n';
    content += '4. معلومات الاتصال للتصعيد\n';
    content += '5. تقدير الوقت لكل خطوة\n\n';

    content += '### 4. اختبارات DR\n\n';
    content += '**الأولوية**: متوسطة\n\n';
    content += 'جدولة اختبارات منتظمة:\n';
    content += '- **شهرياً**: اختبار استرجاع النسخة الاحتياطية\n';
    content += '- **ربع سنوي**: محاكاة فشل كامل للنظام\n';
    content += '- **سنوياً**: تمرين DR كامل مع الفريق\n\n';

    content += '### 5. Monitoring & Alerting\n\n';
    content += '**الأولوية**: متوسطة\n\n';
    content += 'إعداد تنبيهات لـ:\n';
    content += '- فشل النسخة الاحتياطية\n';
    content += '- امتلاء مساحة التخزين\n';
    content += '- فشل health checks\n';
    content += '- تدهور الأداء\n\n';

    // Closure Questions
    content += '## ❓ أسئلة الإقفال\n\n';
    content += 'يجب الإجابة على الأسئلة التالية قبل اعتبار DR جاهز:\n\n';

    const questions = [
      'ما هو RTO المقبول لكل مكون؟',
      'ما هو RPO المقبول لكل مكون؟',
      'أين يتم تخزين النسخ الاحتياطية؟',
      'كم مرة يتم إجراء النسخ الاحتياطي؟',
      'ما هي مدة الاحتفاظ بالنسخ الاحتياطية؟',
      'هل تم اختبار استرجاع النسخة الاحتياطية؟',
      'من المسؤول عن تنفيذ DR عند الحاجة؟',
      'هل هناك موقع بديل (failover site)؟',
      'كيف يتم إعلام المستخدمين عند حدوث كارثة؟',
      'ما هي إجراءات التصعيد في حالة الطوارئ؟',
      'هل البيانات مشفرة في النسخ الاحتياطية؟',
      'هل يمكن استرجاع نسخة من نقطة زمنية محددة (Point-in-Time Recovery)؟',
      'ما هي تكلفة وقت التوقف (Downtime Cost)؟',
      'هل تم توثيق dependencies بين المكونات؟',
      'ما هي خطة الاتصال في حالة الطوارئ؟',
    ];

    for (let i = 0; i < questions.length; i++) {
      content += `${i + 1}. **${questions[i]}**\n`;
      content += '   - [ ] _الإجابة: [TBD]_\n\n';
    }

    // Action Plan
    content += '## 📝 خطة العمل\n\n';
    content += '### فوري (1-2 أسابيع)\n\n';
    content += '- [ ] إعداد نسخ احتياطية تلقائية لـ MongoDB\n';
    content += '- [ ] توثيق إجراءات الاسترجاع الأساسية\n';
    content += '- [ ] تحديد قيم RTO/RPO لكل مكون\n\n';

    content += '### قصير المدى (1 شهر)\n\n';
    content += '- [ ] اختبار استرجاع النسخة الاحتياطية\n';
    content += '- [ ] إنشاء Runbooks كاملة\n';
    content += '- [ ] إعداد monitoring للنسخ الاحتياطية\n';
    content += '- [ ] تحديد SLIs/SLAs\n\n';

    content += '### متوسط المدى (3 أشهر)\n\n';
    content += '- [ ] إعداد موقع failover\n';
    content += '- [ ] تنفيذ Point-in-Time Recovery\n';
    content += '- [ ] إجراء تمرين DR كامل\n';
    content += '- [ ] مراجعة وتحديث الوثائق\n\n';

    content += '---\n\n';
    content += '_تم إنشاء هذا التقرير تلقائياً بواسطة `tools/audit/dr_probe.ts`_\n';

    fs.writeFileSync(reportPath, content, 'utf-8');
    console.log(`📊 Report generated: ${reportPath}`);
  }

  /**
   * Generate progress bar
   */
  private generateProgressBar(label: string, percent: number): string {
    const barLength = 30;
    const filledLength = Math.round((percent / 100) * barLength);
    const emptyLength = barLength - filledLength;

    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);

    return `**${label}**: [${filled}${empty}] ${percent}%\n`;
  }
}

// Run the audit
const auditor = new DRProbeAuditor();
auditor.audit().catch((error) => {
  console.error('❌ Error during audit:', error);
  process.exit(1);
});

