/**
 * Test Helper Utilities
 * Shared utilities and helpers for tests
 */

/**
 * Wait for a server to be ready by polling an endpoint
 * @param {string} url - The URL to check
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} delayMs - Delay between attempts in milliseconds
 * @returns {Promise<boolean>} - True if server is ready, false otherwise
 */
async function waitForServer(url, maxAttempts = 30, delayMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Server is ready at ${url}`);
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  console.error(`Server did not become ready after ${maxAttempts} attempts`);
  return false;
}

/**
 * Get the base URL for API tests
 * @returns {string} - The base URL
 */
function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Measure the execution time of an async function
 * @param {Function} fn - Async function to measure
 * @returns {Promise<{result: any, time: number}>} - Result and time in milliseconds
 */
async function measureTime(fn) {
  const start = Date.now();
  const result = await fn();
  const time = Date.now() - start;
  return { result, time };
}

/**
 * Create a timeout promise
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} - Promise that rejects after timeout
 */
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<any>} - Result of the function
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

module.exports = {
  waitForServer,
  getBaseUrl,
  measureTime,
  timeout,
  retryWithBackoff,
};

