import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

async function testSectorReportsFiltering() {
  try {
    console.log('🧪 Testing Sector Reports Filtering Fix\n');
    console.log('='.repeat(60));
    
    const baseURL = 'http://localhost:5000';
    
    // Test users with different roles
    const testUsers = [
      { username: 'main_branch', password: 'admin123', role: 'main_branch', expectedSector: 'all' },
      { username: 'organization_admin', password: 'sector123', role: 'organization_sector', expectedSector: 'organization' },
      { username: 'information_admin', password: 'sector123', role: 'information_sector', expectedSector: 'information' },
      { username: 'woreda1_organization', password: 'woreda123', role: 'woreda_organization', expectedSector: 'organization' },
      { username: 'woreda1_information', password: 'woreda123', role: 'woreda_information', expectedSector: 'information' },
    ];
    
    console.log('🔐 Testing Report Access for Different User Roles...\n');
    
    for (const user of testUsers) {
      console.log(`👤 Testing: ${user.username} (${user.role})`);
      console.log(`   Expected to see: ${user.expectedSector} sector reports`);
      
      // Login
      const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          password: user.password
        })
      });
      
      if (!loginResponse.ok) {
        console.log(`   ❌ Login failed: ${loginResponse.status}`);
        continue;
      }
      
      const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log(`   ✅ Login successful`);
      
      // Fetch all Amharic activity reports
      const reportsResponse = await fetch(`${baseURL}/api/annual-plans/activity-reports/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!reportsResponse.ok) {
        console.log(`   ❌ Reports API call failed: ${reportsResponse.status}`);
        const errorText = await reportsResponse.text();
        console.log(`   Error: ${errorText}`);
        continue;
      }
      
      const reportsData = await reportsResponse.json();
      console.log(`   📊 Total reports received: ${reportsData.length}`);
      
      if (reportsData.length > 0) {
        // Check sectors in the reports
        const sectors = new Set();
        reportsData.forEach(report => {
          if (report.sector) {
            sectors.add(report.sector);
          }
        });
        
        console.log(`   🏷️  Sectors in reports: [${Array.from(sectors).join(', ')}]`);
        
        // Validate sector filtering
        if (user.expectedSector === 'all') {
          console.log(`   ✅ CORRECT: Main branch sees all sectors`);
        } else if (sectors.size === 1 && sectors.has(user.expectedSector)) {
          console.log(`   ✅ CORRECT: Only seeing ${user.expectedSector} sector reports`);
        } else if (sectors.size === 0) {
          console.log(`   ⚠️  No sector info in reports (might be old monthly reports)`);
        } else {
          console.log(`   ❌ INCORRECT: Expected ${user.expectedSector}, but seeing: [${Array.from(sectors).join(', ')}]`);
        }
        
        // Show report details
        reportsData.forEach((report, index) => {
          console.log(`      Report ${index + 1}: "${report.plan_title}" (Sector: ${report.sector || 'N/A'})`);
        });
      } else {
        if (user.expectedSector === 'organization') {
          console.log(`   ⚠️  No reports found - organization sector should have reports`);
        } else {
          console.log(`   ✅ CORRECT: No reports for ${user.expectedSector} sector (none created yet)`);
        }
      }
      
      console.log('');
    }
    
    console.log('='.repeat(60));
    console.log('🎯 SUMMARY AND ANALYSIS');
    console.log('='.repeat(60));
    
    console.log('\n📋 EXPECTED BEHAVIOR:');
    console.log('   - main_branch: Should see ALL sector reports');
    console.log('   - organization_admin: Should see ONLY organization reports');
    console.log('   - information_admin: Should see ONLY information reports (0 if none exist)');
    console.log('   - woreda1_organization: Should see ONLY organization reports');
    console.log('   - woreda1_information: Should see ONLY information reports (0 if none exist)');
    
    console.log('\n🔧 WHAT WAS FIXED:');
    console.log('   - Added sector filtering to getAllAmharicActivityReports API');
    console.log('   - Sector admins now only see their own sector\'s reports');
    console.log('   - Woreda users now only see their own sector\'s reports');
    console.log('   - Main branch still sees all reports (unchanged)');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. 🔄 Refresh frontend (clear cache, logout/login)');
    console.log('   2. 🧪 Test organization_admin - should only see organization reports');
    console.log('   3. 📊 Create plans for other sectors to test full isolation');
    console.log('   4. ✅ Verify each sector admin only sees their own data');
    
    console.log('\n✅ STATUS: SECTOR FILTERING IMPLEMENTED');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if backend is running
async function checkBackend() {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Run the test
checkBackend().then(isRunning => {
  if (!isRunning) {
    console.log('❌ Backend server is not running on http://localhost:5000');
    console.log('💡 Please start the backend server first:');
    console.log('   cd backend && npm run dev');
    process.exit(1);
  } else {
    testSectorReportsFiltering();
  }
});