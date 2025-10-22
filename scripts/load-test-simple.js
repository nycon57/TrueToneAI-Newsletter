#!/usr/bin/env node

/**
 * Simple Load Testing Script
 * Tests the performance under various load conditions
 */

const http = require('http');
const https = require('https');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';
const DURATION_SECONDS = parseInt(process.env.DURATION || '30');
const CONCURRENT_USERS = parseInt(process.env.USERS || '10');

// Parse URL
const url = new URL(TARGET_URL);
const client = url.protocol === 'https:' ? https : http;

// Statistics
let stats = {
  requests: 0,
  successful: 0,
  failed: 0,
  totalResponseTime: 0,
  responseTimes: [],
  statusCodes: {},
  errors: []
};

/**
 * Make a single request
 */
function makeRequest() {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const req = client.get(TARGET_URL, (res) => {
      const responseTime = Date.now() - startTime;

      // Drain response
      res.on('data', () => {});
      res.on('end', () => {
        stats.requests++;
        stats.successful++;
        stats.totalResponseTime += responseTime;
        stats.responseTimes.push(responseTime);
        stats.statusCodes[res.statusCode] = (stats.statusCodes[res.statusCode] || 0) + 1;
        resolve();
      });
    });

    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      stats.requests++;
      stats.failed++;
      stats.errors.push(err.message);
      resolve();
    });

    req.setTimeout(5000, () => {
      req.destroy();
      stats.requests++;
      stats.failed++;
      stats.errors.push('Timeout');
      resolve();
    });
  });
}

/**
 * Simulate a single user making continuous requests
 */
async function simulateUser(userId) {
  const endTime = Date.now() + (DURATION_SECONDS * 1000);

  while (Date.now() < endTime) {
    await makeRequest();
    // Random delay between requests (100-500ms)
    await new Promise(r => setTimeout(r, 100 + Math.random() * 400));
  }
}

/**
 * Calculate percentile
 */
function percentile(arr, p) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[index];
}

/**
 * Print results
 */
function printResults() {
  console.log('\n=================================');
  console.log('       LOAD TEST RESULTS');
  console.log('=================================\n');

  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Duration: ${DURATION_SECONDS} seconds`);
  console.log(`Concurrent Users: ${CONCURRENT_USERS}\n`);

  console.log('Summary:');
  console.log(`  Total Requests: ${stats.requests}`);
  console.log(`  Successful: ${stats.successful} (${((stats.successful / stats.requests) * 100).toFixed(1)}%)`);
  console.log(`  Failed: ${stats.failed} (${((stats.failed / stats.requests) * 100).toFixed(1)}%)`);
  console.log(`  Requests/sec: ${(stats.requests / DURATION_SECONDS).toFixed(1)}\n`);

  if (stats.responseTimes.length > 0 && stats.successful > 0) {
    console.log('Response Times:');
    console.log(`  Mean: ${Math.round(stats.totalResponseTime / stats.successful)}ms`);
    console.log(`  Min: ${Math.min(...stats.responseTimes)}ms`);
    console.log(`  Max: ${Math.max(...stats.responseTimes)}ms`);
    console.log(`  P50: ${percentile(stats.responseTimes, 50)}ms`);
    console.log(`  P95: ${percentile(stats.responseTimes, 95)}ms`);
    console.log(`  P99: ${percentile(stats.responseTimes, 99)}ms\n`);
  } else {
    console.log('Response Times: N/A (no successful requests)\n');
  }

  console.log('Status Codes:');
  Object.entries(stats.statusCodes).forEach(([code, count]) => {
    console.log(`  ${code}: ${count}`);
  });

  if (stats.errors.length > 0) {
    console.log('\nErrors (first 5):');
    const uniqueErrors = [...new Set(stats.errors)];
    uniqueErrors.slice(0, 5).forEach(err => {
      const count = stats.errors.filter(e => e === err).length;
      console.log(`  ${err}: ${count} occurrences`);
    });
  }

  console.log('\n=================================\n');

  // Performance assessment
  const avgResponseTime = stats.successful > 0 ? Math.round(stats.totalResponseTime / stats.successful) : Infinity;
  const successRate = stats.requests > 0 ? (stats.successful / stats.requests) * 100 : 0;

  if (successRate >= 99 && avgResponseTime < 500) {
    console.log('✅ EXCELLENT: System performing very well under load');
  } else if (successRate >= 95 && avgResponseTime < 1000) {
    console.log('✓ GOOD: System handling load adequately');
  } else if (successRate >= 90) {
    console.log('⚠️  WARNING: System showing signs of stress');
  } else {
    console.log('❌ CRITICAL: System struggling under load');
  }
}

/**
 * Run load test
 */
async function runLoadTest() {
  console.log('Starting load test...');
  console.log(`Simulating ${CONCURRENT_USERS} concurrent users for ${DURATION_SECONDS} seconds\n`);

  const startTime = Date.now();

  // Start progress indicator
  const progressInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const remaining = DURATION_SECONDS - elapsed;
    process.stdout.write(`\rProgress: ${elapsed}s / ${DURATION_SECONDS}s | Requests: ${stats.requests} | Failed: ${stats.failed}`);
  }, 1000);

  try {
    // Create user simulations
    const users = [];
    for (let i = 0; i < CONCURRENT_USERS; i++) {
      users.push(simulateUser(i));
    }

    // Wait for all users to complete
    await Promise.all(users);

    clearInterval(progressInterval);
    console.log('\n'); // New line after progress

    printResults();

  } catch (error) {
    clearInterval(progressInterval);
    console.error('\nError during load test:', error);
    process.exit(1);
  }
}

// Check if server is available
console.log(`Checking server availability at ${TARGET_URL}...`);

const checkReq = client.get(TARGET_URL, (res) => {
  res.on('data', () => {});
  res.on('end', () => {
    console.log('Server is responding. Starting load test...\n');
    runLoadTest();
  });
});

checkReq.on('error', (err) => {
  console.error(`Cannot connect to ${TARGET_URL}`);
  console.error('Error:', err.message);
  console.log('\nMake sure the server is running: npm run dev');
  process.exit(1);
});

checkReq.setTimeout(5000, () => {
  console.error(`Server at ${TARGET_URL} is not responding`);
  process.exit(1);
});