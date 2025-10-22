/**
 * Web Vitals Performance Monitoring
 * Track and report Core Web Vitals metrics
 */

import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals';

// Threshold values for Web Vitals (in milliseconds)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint
};

/**
 * Get rating for a metric value
 */
function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';

  if (metricName === 'CLS') {
    // CLS is not in milliseconds
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Send analytics data to your analytics endpoint
 */
function sendToAnalytics(metric: Metric) {
  const rating = getRating(metric.name, metric.value);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });
  }

  // Send to your analytics endpoint
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now(),
    // Add user context if needed
    userAgent: navigator.userAgent,
    connection: (navigator as any).connection?.effectiveType,
  });

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    // Fallback to fetch
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch((error) => {
      console.error('Failed to send Web Vitals:', error);
    });
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  onINP(sendToAnalytics);
}

/**
 * Custom performance marks for specific features
 */
export function markFeatureStart(featureName: string) {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(`${featureName}-start`);
  }
}

export function markFeatureEnd(featureName: string) {
  if (typeof window !== 'undefined' && window.performance) {
    const startMark = `${featureName}-start`;
    const endMark = `${featureName}-end`;
    const measureName = `${featureName}-duration`;

    performance.mark(endMark);

    try {
      performance.measure(measureName, startMark, endMark);
      const measures = performance.getEntriesByName(measureName);

      if (measures.length > 0) {
        const duration = measures[0].duration;

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${featureName} took ${duration.toFixed(2)}ms`);
        }

        // Send to analytics
        sendToAnalytics({
          name: featureName,
          value: duration,
          delta: duration,
          id: `${featureName}-${Date.now()}`,
          navigationType: 'navigate',
          rating: duration < 1000 ? 'good' : duration < 3000 ? 'needs-improvement' : 'poor',
          entries: [],
        } as any);
      }
    } catch (error) {
      console.error(`Failed to measure ${featureName}:`, error);
    }
  }
}

/**
 * Track resource loading performance
 */
export function trackResourceTiming() {
  if (typeof window !== 'undefined' && window.performance) {
    const resources = performance.getEntriesByType('resource');

    const slowResources = resources
      .filter(r => r.duration > 500)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    if (process.env.NODE_ENV === 'development' && slowResources.length > 0) {
      console.table(slowResources.map(r => ({
        name: r.name.split('/').pop(),
        duration: `${r.duration.toFixed(0)}ms`,
        type: (r as PerformanceResourceTiming).initiatorType,
        size: `${((r as PerformanceResourceTiming).transferSize / 1024).toFixed(1)}KB`,
      })));
    }
  }
}

/**
 * Get current performance metrics
 */
export function getCurrentMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigation) {
    return null;
  }

  return {
    // Navigation timings
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // Resource counts
    resources: performance.getEntriesByType('resource').length,

    // Memory (if available)
    memory: (performance as any).memory ? {
      used: ((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2),
      total: ((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2),
      limit: ((performance as any).memory.jsHeapSizeLimit / 1048576).toFixed(2),
    } : null,
  };
}