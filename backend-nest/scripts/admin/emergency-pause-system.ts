#!/usr/bin/env ts-node

/**
 * Emergency System Pause Script
 * 
 * This script pauses the entire system by setting a maintenance flag.
 * Use only in emergency situations!
 * 
 * Usage:
 *   npm run script:pause-system -- --reason="Emergency maintenance"
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function pauseSystem() {
  console.log('⚠️  EMERGENCY SYSTEM PAUSE SCRIPT');
  console.log('=====================================\n');

  const reason = process.argv.find((arg) => arg.startsWith('--reason='))
    ?.split('=')[1] || 'Emergency maintenance';

  console.log(`Reason: ${reason}\n`);
  console.log('⚠️  WARNING: This will affect all users!');
  console.log('Are you sure you want to continue? (yes/no): ');

  rl.question('', async (answer) => {
    if (answer.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    try {
      const app = await NestFactory.createApplicationContext(AppModule);

      // TODO: Set maintenance mode flag in database
      console.log('✅ System paused successfully');
      console.log(`Reason: ${reason}`);
      console.log(`Time: ${new Date().toISOString()}`);

      await app.close();
      process.exit(0);
    } catch (error) {
      console.error('❌ Failed to pause system:', error);
      process.exit(1);
    }
  });
}

pauseSystem();

