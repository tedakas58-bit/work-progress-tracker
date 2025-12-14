#!/usr/bin/env node

/**
 * Backend Status Checker
 * Tests if the production backend is alive and responding
 */

const https = require('https');

const BACKEND_URL = 'https://work-progress-tracker.onrender.com';
const HEALTH_ENDPOINT = '/api/health';

console.log('🔍 Testing Backend Status...');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Health Check: ${BACKEND_URL}${HEALTH_ENDPOINT}`);
console.log('─'.repeat(50));

function testEndpoint(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.get(url, { timeout }, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          responseTime,
          data: data.toString(),
          headers: res.headers
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

async function checkBackendStatus() {
  try {
    console.log('⏳ Checking health endpoint...');
    
    const result = await testEndpoint(`${BACKEND_URL}${HEALTH_ENDPOINT}`);
    
    console.log(`✅ Status: ${result.status}`);
    console.log(`⚡ Response Time: ${result.responseTime}ms`);
    console.log(`📄 Response: ${result.data}`);
    
    if (result.status === 200) {
      console.log('🎉 Backend is ALIVE and responding!');
      
      // Test a few more endpoints
      console.log('\n🔍 Testing additional endpoints...');
      
      const endpoints = [
        '/api/auth/profile',
        '/api/annual-plans',
        '/api/reports/current-month/all'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing: ${endpoint}`);
          const testResult = await testEndpoint(`${BACKEND_URL}${endpoint}`);
          console.log(`  Status: ${testResult.status} (${testResult.responseTime}ms)`);
        } catch (error) {
          console.log(`  Error: ${error.message}`);
        }
      }
      
    } else {
      console.log(`❌ Backend returned status: ${result.status}`);
      console.log('Response:', result.data);
    }
    
  } catch (error) {
    console.log(`❌ Backend is NOT responding: ${error.message}`);
    
    if (error.message.includes('timeout')) {
      console.log('\n💡 This might be because:');
      console.log('   1. Backend is sleeping (Render free tier)');
      console.log('   2. Backend is not deployed');
      console.log('   3. Network connectivity issues');
      console.log('\n🔄 Trying to wake up backend...');
      console.log('   Please wait 30-60 seconds and try again.');
    }
  }
}

// Run the check
checkBackendStatus().then(() => {
  console.log('\n─'.repeat(50));
  console.log('✅ Backend status check complete!');
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
});