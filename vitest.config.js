import { defineConfig } from 'vitest/config';

// JUnit output (for CircleCI store_test_results → Test Insights, flaky detection,
// and timing-based test splitting) is enabled in CI; local runs stay quiet.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    reporters: process.env.CI ? ['default', 'junit'] : ['default'],
    outputFile: { junit: 'test-results/junit.xml' },
  },
});
