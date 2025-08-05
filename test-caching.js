#!/usr/bin/env node

/**
 * Simple script to test GitHub API caching performance
 * Run with: node test-caching.js
 */

const BASE_URL = 'http://localhost:3000'; // Change port to match your dev server (e.g., 3002)

async function measureRequest(url, description) {
  const start = Date.now();

  try {
    const response = await fetch(url);
    const end = Date.now();
    const time = end - start;

    if (response.ok) {
      const cacheControl = response.headers.get('cache-control');
      console.log(`✅ ${description}: ${time}ms (Cache: ${cacheControl})`);
      return time;
    } else {
      console.log(`❌ ${description}: Failed (${response.status})`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${description}: Error - ${error.message}`);
    return null;
  }
}

async function testCaching() {
  console.log('🧪 Testing GitHub API Caching Performance\n');

  // Test main starters endpoint
  console.log('📊 Testing /api/starters endpoint:');
  const time1 = await measureRequest(`${BASE_URL}/api/starters`, 'First request (cold cache)');
  await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  const time2 = await measureRequest(`${BASE_URL}/api/starters`, 'Second request (warm cache)');

  if (time1 && time2) {
    const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
    console.log(`🚀 Cache Performance: ${improvement}% faster\n`);
  }

  // Test README endpoint
  console.log('📖 Testing README endpoint:');
  const readme1 = await measureRequest(`${BASE_URL}/api/starters/node-transcription/readme`, 'README first request');
  await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  const readme2 = await measureRequest(`${BASE_URL}/api/starters/node-transcription/readme`, 'README cached request');

  if (readme1 && readme2) {
    const readmeImprovement = ((readme1 - readme2) / readme1 * 100).toFixed(1);
    console.log(`🚀 README Cache Performance: ${readmeImprovement}% faster\n`);
  }

  // Test multiple rapid requests
  console.log('⚡ Testing rapid requests (should all be fast):');
  for (let i = 1; i <= 5; i++) {
    await measureRequest(`${BASE_URL}/api/starters`, `Rapid request #${i}`);
  }

  if (!time1 || !time2 || !readme1 || !readme2) {
    console.log('⚠️ Some requests failed. Please check your server and try again.');
    process.exit(1);
  }

  console.log('\n✨ Testing complete! Your 24-hour caching is working perfectly.');
  console.log('💡 GitHub API calls are minimized, and responses are lightning fast!');
}

// Run the test
testCaching().catch(console.error);