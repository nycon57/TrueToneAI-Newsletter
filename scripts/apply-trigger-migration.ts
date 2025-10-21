#!/usr/bin/env tsx
/**
 * Apply Stripe Subscription Sync Trigger Migration
 *
 * This script applies the Postgres trigger that syncs stripe.subscriptions
 * to public.users automatically.
 *
 * Usage:
 *   npx tsx scripts/apply-trigger-migration.ts
 */

import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL or DIRECT_URL environment variable is not set');
  console.error('');
  console.error('Please add DATABASE_URL or DIRECT_URL to your .env file');
  process.exit(1);
}

console.log('Using connection:', DATABASE_URL.replace(/:[^:]*@/, ':****@'));

async function main() {
  console.log('🚀 Applying Stripe subscription sync trigger migration...');
  console.log('');

  // Read the SQL migration file
  const migrationPath = path.resolve(
    __dirname,
    '../supabase/migrations/20250121_stripe_subscription_sync.sql'
  );

  console.log('📄 Reading migration file:', migrationPath);

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8');

  // Create Postgres client
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');
    console.log('');

    console.log('⚙️  Executing SQL migration...');
    console.log('');

    await client.query(sql);

    console.log('✅ Migration applied successfully!');
    console.log('');
    console.log('Created:');
    console.log('  - Function: sync_subscription_to_user()');
    console.log('  - Trigger: sync_subscription_on_change on stripe.subscriptions');
    console.log('');
    console.log('How it works:');
    console.log('  1. Stripe webhook arrives → Sync Engine updates stripe.subscriptions');
    console.log('  2. Postgres trigger fires → sync_subscription_to_user() runs');
    console.log('  3. Function updates public.users with subscription details');
    console.log('  4. User tier, limits, and onboarding status updated automatically');
    console.log('');
    console.log('Next steps:');
    console.log('  ✅ Stripe schema created');
    console.log('  ✅ Trigger function created');
    console.log('  → Deploy Edge Function (supabase functions deploy)');
    console.log('  → Fix frontend components (Phase 4)');
    console.log('  → Test end-to-end flow (Phase 5)');
    console.log('');

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error('');

    if (error.message.includes('already exists')) {
      console.log('ℹ️  The trigger or function may already exist.');
      console.log('   This is OK - it means the migration was already applied.');
      console.log('');
    } else {
      console.error('Full error:', error);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

main();
