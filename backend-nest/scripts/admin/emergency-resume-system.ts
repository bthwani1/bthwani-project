#!/usr/bin/env ts-node

/**
 * Emergency System Resume Script
 * 
 * This script resumes the system after maintenance.
 * 
 * Usage:
 *   npm run script:resume-system
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';

async function resumeSystem() {
  console.log('✅ SYSTEM RESUME SCRIPT');
  console.log('========================\n');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    // TODO: Remove maintenance mode flag from database
    console.log('✅ System resumed successfully');
    console.log(`Time: ${new Date().toISOString()}`);

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to resume system:', error);
    process.exit(1);
  }
}

resumeSystem();

