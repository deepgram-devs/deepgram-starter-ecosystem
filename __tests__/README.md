# Test Suite Documentation

## Overview

This test suite provides comprehensive integration testing for the Deepgram Starter Ecosystem application. The tests focus on validating GitHub API integration, data transformation, error handling, and caching performance.

## Test Structure

```
__tests__/
├── api/
│   ├── starters.test.js           # API endpoint tests
│   └── error-handling.test.js     # Error handling tests
├── integration/
│   └── github-repos.test.js       # GitHub repository validation
├── lib/
│   └── github.test.js             # Data transformation tests
├── performance/
│   └── caching.test.js            # Cache performance tests
├── helpers/
│   └── test-utils.js              # Shared test utilities
└── README.md                      # How to instructions
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- **Test Environment:** Node.js
- **Test Pattern:** `**/__tests__/**/*.test.js`
- **Timeout:** 30 seconds (for API calls)
- **Coverage:** Configured for `src/**` files

### Setup File (`jest.setup.js`)

- Loads environment variables from `.env.test`
- Sets global test timeout
- Configures console output

## Prerequisites

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.test` file in the project root. See [`.env.test.example`](../.env.test.example)

### 3. Start the Development Server

Tests require the Next.js development server to be running:

```bash
npm run dev
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test Suites

```bash
# API endpoint tests only
npm run test:api

# Integration tests only
npm run test:integration

# Run with coverage report
npm run test:coverage
```

### Run Individual Test Files

```bash
# Run a specific test file
npx jest __tests__/api/starters.test.js

# Run with verbose output
npx jest __tests__/api/starters.test.js --verbose
```

### Performance Tests Only

```bash
npm run test:performance
```

This runs only the cache performance tests from `__tests__/performance/`.

## Test Suites

### API Endpoint Tests (`api/starters.test.js`)

Tests the `/api/starters` and `/api/starters/[slug]/readme` endpoints:

- Response status codes
- JSON data structure
- Cache headers
- Data integrity

### GitHub Repository Validation (`integration/github-repos.test.js`)

Validates that starter repository data is properly formatted and configured:

- Repository URL structure validation
- Public repo data verification
- TOML configuration handling
- Data quality checks


**Note:** These tests do NOT make HTTP requests to github.com. They validate our data structure and URL formatting only.

### Data Transformation Tests (`lib/github.test.js`)

Tests the data transformation logic:

- Transformation accuracy
- Required field presence
- Optional field handling
- TOML config merging

### Error Handling Tests (`api/error-handling.test.js`)

Tests error conditions and graceful degradation:

- 404 Not Found errors
- Network timeouts
- Invalid input
- Data consistency

**Note:** These tests verify our error handling code works correctly. We do NOT test whether GitHub returns specific error codes - we assume GitHub works correctly and test our handling of those scenarios.

### Cache Performance Tests (`performance/caching.test.js`)

Tests caching behavior and performance:

- Cache hit/miss performance
- Cache header validation
- Rapid request handling
- 24-hour cache duration

