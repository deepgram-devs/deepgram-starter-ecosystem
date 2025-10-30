// Load environment variables from .env.test (local dev)
// In CI, variables are set directly via env: block in workflow
require('dotenv').config({ path: '.env.test' });

// Set longer timeout for integration tests
jest.setTimeout(30000);

// Clean up after all tests complete
afterAll(async () => {
  // Give time for any pending async operations to complete
  await new Promise(resolve => setTimeout(resolve, 500));
});

// Global test configuration
global.console = {
  ...console,
  // Suppress console logs during tests (optional)
  // Uncomment these lines if you want cleaner test output
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

