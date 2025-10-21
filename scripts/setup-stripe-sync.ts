#!/usr/bin/env tsx
/**
 * Stripe Sync Engine - Schema Migration Script
 *
 * This script creates the necessary database tables for syncing Stripe data
 * to your Postgres database using @supabase/stripe-sync-engine.
 *
 * Tables created:
 * - stripe.customers
 * - stripe.subscriptions
 * - stripe.invoices
 * - stripe.payment_intents
 * - stripe.charges
 * - stripe.payment_methods
 * - stripe.prices
 * - stripe.products
 * - And more...
 *
 * Usage:
 *   npx tsx scripts/setup-stripe-sync.ts
 */

import { runMigrations } from '@supabase/stripe-sync-engine';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Try DIRECT_URL first (bypasses pooler), fall back to DATABASE_URL
const DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL or DIRECT_URL environment variable is not set');
  console.error('');
  console.error('Please add DIRECT_URL or DATABASE_URL to your .env file:');
  console.error('DIRECT_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"');
  console.error('');
  console.error('Use DIRECT_URL for direct database connection (recommended for migrations).');
  process.exit(1);
}

async function main() {
  console.log('🚀 Starting Stripe Sync Engine schema migration...');
  console.log('');
  console.log('Database:', DATABASE_URL.replace(/:[^:]*@/, ':****@')); // Hide password
  console.log('Schema: stripe');
  console.log('');

  try {
    await runMigrations({
      databaseUrl: DATABASE_URL,
      schema: 'stripe',
      logger: console,
    });

    console.log('');
    console.log('✅ Stripe sync schema created successfully!');
    console.log('');
    console.log('Tables created in the "stripe" schema:');
    console.log('  - stripe.customers');
    console.log('  - stripe.subscriptions');
    console.log('  - stripe.invoices');
    console.log('  - stripe.payment_intents');
    console.log('  - stripe.charges');
    console.log('  - stripe.payment_methods');
    console.log('  - stripe.prices');
    console.log('  - stripe.products');
    console.log('  - And more...');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Create the Stripe webhook Edge Function');
    console.log('  2. Deploy the Edge Function to Supabase');
    console.log('  3. Configure the Stripe webhook endpoint');
    console.log('');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('');
    console.error('Common issues:');
    console.error('  - Check that DATABASE_URL is correct');
    console.error('  - Ensure you have network access to Supabase');
    console.error('  - Verify your database credentials are valid');
    console.error('');
    process.exit(1);
  }
}

main();
