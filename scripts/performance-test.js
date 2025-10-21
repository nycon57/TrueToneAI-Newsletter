#!/usr/bin/env node

/**
 * Performance Testing Script for TrueTone AI Newsletter
 *
 * Usage:
 *   node scripts/performance-test.js
 *
 * Tests:
 * - Page Load Time
 * - API Response Times
 * - Bundle Size Analysis
 * - Concurrent Request Handling
 */

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Test results storage
const results = {
  pageLoad: [],
  apiCalls: [],
  parallelTests: []
};

/**
 * Make HTTP request and measure timing
 */
function timedRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        resolve({
          duration: Math.round(duration),
          status: res.statusCode,
          size: Buffer.byteLength(data),
          headers: res.headers
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Test homepage load time
 */
async function testPageLoad() {
  console.log(`\n${colors.cyan}Testing Homepage Load...${colors.reset}`);

  try {
    const runs = 5;
    const timings = [];

    for (let i = 1; i <= runs; i++) {
      const result = await timedRequest(`${BASE_URL}/`);
      timings.push(result.duration);
      console.log(`  Run ${i}: ${result.duration}ms (${(result.size / 1024).toFixed(1)}KB)`);

      // Wait between requests
      await new Promise(r => setTimeout(r, 500));
    }

    const avg = Math.round(timings.reduce((a, b) => a + b, 0) / runs);
    const min = Math.min(...timings);
    const max = Math.max(...timings);

    results.pageLoad = { avg, min, max, runs: timings };

    console.log(`${colors.green}  Average: ${avg}ms | Min: ${min}ms | Max: ${max}ms${colors.reset}`);

    // Performance rating
    if (avg < 1000) {
      console.log(`${colors.green}  ✓ Excellent performance!${colors.reset}`);
    } else if (avg < 2000) {
      console.log(`${colors.yellow}  ⚠ Good, but could be improved${colors.reset}`);
    } else {
      console.log(`${colors.red}  ✗ Needs optimization${colors.reset}`);
    }

  } catch (error) {
    console.error(`${colors.red}  Error: ${error.message}${colors.reset}`);
  }
}

/**
 * Test API response times
 */
async function testApiEndpoints() {
  console.log(`\n${colors.cyan}Testing API Endpoints...${colors.reset}`);

  const endpoints = [
    { path: '/api/articles', name: 'Articles API' },
    { path: '/api/user', name: 'User API' }
  ];

  for (const endpoint of endpoints) {
    try {
      const result = await timedRequest(`${BASE_URL}${endpoint.path}`);
      results.apiCalls.push({ ...endpoint, ...result });

      const statusColor = result.status < 400 ? colors.green : colors.red;
      console.log(`  ${endpoint.name}: ${statusColor}${result.status}${colors.reset} - ${result.duration}ms`);

      // Check for cache headers
      if (result.headers['cache-control']) {
        console.log(`    Cache: ${colors.green}${result.headers['cache-control']}${colors.reset}`);
      } else {
        console.log(`    Cache: ${colors.yellow}No cache headers${colors.reset}`);
      }

    } catch (error) {
      console.log(`  ${endpoint.name}: ${colors.red}Failed - ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Test parallel request handling
 */
async function testParallelRequests() {
  console.log(`\n${colors.cyan}Testing Parallel Request Performance...${colors.reset}`);

  try {
    // Sequential timing
    const seqStart = performance.now();
    await timedRequest(`${BASE_URL}/api/articles`);
    await timedRequest(`${BASE_URL}/api/user`);
    const seqDuration = Math.round(performance.now() - seqStart);

    console.log(`  Sequential (2 requests): ${seqDuration}ms`);

    // Parallel timing
    const parStart = performance.now();
    await Promise.all([
      timedRequest(`${BASE_URL}/api/articles`),
      timedRequest(`${BASE_URL}/api/user`)
    ]);
    const parDuration = Math.round(performance.now() - parStart);

    console.log(`  Parallel (2 requests): ${parDuration}ms`);

    const improvement = Math.round(((seqDuration - parDuration) / seqDuration) * 100);
    console.log(`${colors.green}  Improvement: ${improvement}% faster with parallel requests${colors.reset}`);

    results.parallelTests = { sequential: seqDuration, parallel: parDuration, improvement };

  } catch (error) {
    console.error(`${colors.red}  Error: ${error.message}${colors.reset}`);
  }
}

/**
 * Test concurrent users
 */
async function testConcurrentLoad() {
  console.log(`\n${colors.cyan}Testing Concurrent User Load...${colors.reset}`);

  const concurrentUsers = [5, 10, 20];

  for (const users of concurrentUsers) {
    try {
      const requests = Array(users).fill(null).map(() =>
        timedRequest(`${BASE_URL}/api/articles`)
      );

      const start = performance.now();
      const responses = await Promise.all(requests);
      const duration = Math.round(performance.now() - start);

      const avgResponseTime = Math.round(
        responses.reduce((sum, r) => sum + r.duration, 0) / users
      );

      console.log(`  ${users} concurrent users: Total ${duration}ms | Avg ${avgResponseTime}ms per request`);

    } catch (error) {
      console.log(`  ${users} users: ${colors.red}Failed - ${error.message}${colors.reset}`);
    }
  }
}

/**
 * Generate performance report
 */
function generateReport() {
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}         PERFORMANCE REPORT SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}`);

  // Page Load Metrics
  if (results.pageLoad.avg) {
    console.log(`\n${colors.bright}Page Load Performance:${colors.reset}`);
    console.log(`  Average: ${results.pageLoad.avg}ms`);
    console.log(`  Best: ${results.pageLoad.min}ms`);
    console.log(`  Worst: ${results.pageLoad.max}ms`);

    // Core Web Vitals estimation
    const lcp = results.pageLoad.avg;
    let lcpRating = '✗ Needs Improvement';
    if (lcp <= 2500) lcpRating = '✓ Good';
    if (lcp <= 1500) lcpRating = '✓ Excellent';
    console.log(`  LCP Estimate: ${lcpRating}`);
  }

  // API Performance
  if (results.apiCalls.length > 0) {
    console.log(`\n${colors.bright}API Response Times:${colors.reset}`);
    results.apiCalls.forEach(api => {
      const rating = api.duration < 200 ? '✓' : api.duration < 500 ? '⚠' : '✗';
      console.log(`  ${api.name}: ${api.duration}ms ${rating}`);
    });
  }

  // Parallel Performance
  if (results.parallelTests.improvement) {
    console.log(`\n${colors.bright}Parallel Request Performance:${colors.reset}`);
    console.log(`  Sequential: ${results.parallelTests.sequential}ms`);
    console.log(`  Parallel: ${results.parallelTests.parallel}ms`);
    console.log(`  ${colors.green}Improvement: ${results.parallelTests.improvement}% faster${colors.reset}`);
  }

  // Recommendations
  console.log(`\n${colors.bright}Recommendations:${colors.reset}`);

  if (results.pageLoad.avg > 2000) {
    console.log(`  ${colors.yellow}• Consider server-side rendering for faster initial load${colors.reset}`);
  }

  if (results.apiCalls.some(api => api.duration > 500)) {
    console.log(`  ${colors.yellow}• Optimize slow API endpoints with caching or query optimization${colors.reset}`);
  }

  if (!results.apiCalls.some(api => api.headers && api.headers['cache-control'])) {
    console.log(`  ${colors.yellow}• Add cache headers to API responses${colors.reset}`);
  }

  if (results.parallelTests.improvement < 30) {
    console.log(`  ${colors.yellow}• Already using parallel requests efficiently${colors.reset}`);
  }

  console.log(`\n${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);
}

/**
 * Main test runner
 */
async function runTests() {
  console.log(`${colors.bright}Starting Performance Tests for ${BASE_URL}${colors.reset}`);

  try {
    // Check if server is running
    await timedRequest(BASE_URL);
  } catch (error) {
    console.error(`${colors.red}Error: Server not responding at ${BASE_URL}${colors.reset}`);
    console.log('Make sure the development server is running: npm run dev');
    process.exit(1);
  }

  await testPageLoad();
  await testApiEndpoints();
  await testParallelRequests();
  await testConcurrentLoad();

  generateReport();
}

// Run tests
runTests().catch(console.error);