#!/usr/bin/env node

/**
 * Fuzz Testing Suite for User Endpoints
 * Tests security vulnerabilities without populating the database
 */

console.log("🔧 Script starting...");

// Fuzz Generators
const fuzzGenerators = {
  sqlInjection: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' UNION SELECT * FROM users --",
    "admin'--",
    "1' OR '1'='1'--",
    "'; INSERT INTO users VALUES ('hacker', 'password'); --"
  ],
  
  xss: [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "javascript:alert('XSS')",
    "<svg onload=alert('XSS')>",
    "';alert('XSS');//",
    "<iframe src=javascript:alert('XSS')></iframe>"
  ],
  
  nosqlInjection: [
    '{"$gt": ""}',
    '{"$ne": null}',
    '{"$where": "1==1"}',
    '{"$regex": ".*"}',
    '{"$exists": true}',
    '{"$in": ["admin", "user"]}'
  ],
  
  bufferOverflow: [
    "A".repeat(1000),
    "X".repeat(5000),
    "Z".repeat(10000)
  ],
  
  specialChars: [
    "!@#$%^&*()_+-=[]{}|;':\",./<>?",
    "测试用户",
    "ユーザー",
    "مستخدم",
    "👨‍💻",
    "🚀🔥💯"
  ],
  
  emptyValues: [
    "",
    null,
    undefined,
    "   ",
    "\n\t\r"
  ],
  
  longStrings: [
    "A".repeat(100),
    "B".repeat(500),
    "C".repeat(1000)
  ],
  
  numericEdgeCases: [
    -1,
    0,
    999999999,
    Infinity,
    -Infinity,
    NaN
  ],
  
  typeConfusion: [
    true,
    false,
    [],
    {},
    () => {},
    new Date()
  ]
};

// Test Scenarios will be defined inside main function

// Fuzz Testing Engine
class FuzzTester {
  constructor(baseUrl = "http://localhost:5001") {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async executeTest(scenario, testCase) {
    let url = scenario.endpoint;
    if (!url.startsWith('http')) {
      url = `${this.baseUrl}${url}`;
    }
    
    const options = {
      method: scenario.method,
      headers: {
        'Content-Type': 'application/json',
        ...testCase.headers
      },
      credentials: 'include',
    };

    if (scenario.method === 'POST' && testCase.data) {
      options.body = JSON.stringify(testCase.data);
    }

    try {
      const response = await fetch(url, options);
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: url,
        data: testCase.data,
        headers: testCase.headers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        url: url,
        data: testCase.data,
        headers: testCase.headers
      };
    }
  }

  generateTestCases(scenario, generators) {
    const testCases = [];
    
    for (const [generatorName, payloads] of Object.entries(generators)) {
      for (const payload of payloads) {
        // Generate test data based on scenario fields
        const testData = {};
        const headers = {};
        
        if (scenario.fields.length > 0) {
          // For POST requests with fields
          scenario.fields.forEach(field => {
            testData[field] = payload;
          });
        } else {
          // For GET requests or requests without specific fields
          headers['X-Test-Payload'] = payload;
        }
        
        testCases.push({
          generator: generatorName,
          payload: payload,
          data: testData,
          headers: headers
        });
      }
    }
    
    return testCases;
  }

  async runScenario(scenarioName, testScenarios, selectedGenerators = null) {
    const scenario = testScenarios[scenarioName];
    if (!scenario) {
      throw new Error(`Unknown scenario: ${scenarioName}`);
    }

    const generators = selectedGenerators || fuzzGenerators;
    const testCases = this.generateTestCases(scenario, generators);
    
    console.log(`\n🔍 Testing ${scenario.name} (${testCases.length} test cases)`);
    console.log(`📍 Endpoint: ${scenario.method} ${scenario.endpoint}`);
    
    const results = {
      scenario: scenarioName,
      name: scenario.name,
      totalTests: testCases.length,
      passed: 0,
      failed: 0,
      errors: 0,
      details: []
    };

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const result = await this.executeTest(scenario, testCase);
      
      if (result.success) {
        results.passed++;
      } else if (result.error) {
        results.errors++;
      } else {
        results.failed++;
      }
      
      results.details.push({
        ...result,
        generator: testCase.generator,
        payload: testCase.payload
      });
      
      // Progress indicator
      if ((i + 1) % 10 === 0 || i === testCases.length - 1) {
        process.stdout.write(`\r   Progress: ${i + 1}/${testCases.length}`);
      }
    }
    
    console.log(`\n   ✅ Passed: ${results.passed}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   ⚠️  Errors: ${results.errors}`);
    
    return results;
  }

  async runAllScenarios(testScenarios, selectedGenerators = null) {
    console.log("🚀 Starting Fuzz Testing Suite");
    console.log("=".repeat(50));
    
    const allResults = [];
    
    for (const scenarioName of Object.keys(testScenarios)) {
      try {
        const result = await this.runScenario(scenarioName, testScenarios, selectedGenerators);
        allResults.push(result);
      } catch (error) {
        console.error(`❌ Error testing ${scenarioName}:`, error.message);
      }
    }
    
    return allResults;
  }

  generateReport(results) {
    const totalTests = results.reduce((sum, r) => sum + (r.totalTests || 0), 0);
    const totalPassed = results.reduce((sum, r) => sum + (r.passed || 0), 0);
    const totalFailed = results.reduce((sum, r) => sum + (r.failed || 0), 0);
    const totalErrors = results.reduce((sum, r) => sum + (r.errors || 0), 0);
    
    console.log("\n" + "=".repeat(50));
    console.log("📊 FUZZ TESTING REPORT");
    console.log("=".repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${totalPassed}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(`⚠️  Errors: ${totalErrors}`);
    
    if (totalPassed > 0) {
      console.log("\n🚨 SECURITY WARNING: Some attacks succeeded!");
      console.log("   Review the passed tests for potential vulnerabilities.");
    } else {
      console.log("\n🛡️  SECURITY STATUS: All attacks blocked successfully!");
      console.log("   Your input validation is working correctly.");
    }
    
    return {
      totalTests,
      totalPassed,
      totalFailed,
      totalErrors,
      results
    };
  }
}

// CLI Interface
async function main() {
  console.log("🚀 Starting fuzz test...");
  
  // Import API endpoints
  let API_ENDPOINTS;
  try {
    const apiModule = await import('../src/config/api.js');
    API_ENDPOINTS = apiModule.API_ENDPOINTS;
    console.log("✅ API endpoints imported successfully");
  } catch (error) {
    console.error("❌ Failed to import API endpoints:", error.message);
    process.exit(1);
  }
  
  const args = process.argv.slice(2);
  console.log("📝 Arguments:", args);
  
  const scenario = args.find(arg => arg.startsWith('--scenario='))?.split('=')[1];
  const verbose = args.includes('--verbose');
  const customUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
  
  console.log("🎯 Scenario:", scenario);
  console.log("🌐 Custom URL:", customUrl);
  
  // Define test scenarios with imported API endpoints
  const testScenarios = {
    login: {
      name: "User Login",
      endpoint: API_ENDPOINTS.USER_LOGIN,
      method: "POST",
      fields: ["email", "password"]
    },
    
    preferences: {
      name: "User Preferences",
      endpoint: API_ENDPOINTS.USER_PREFERENCES,
      method: "POST",
      fields: ["language", "textSize"]
    },
    
    checkAuth: {
      name: "Check Authentication",
      endpoint: API_ENDPOINTS.USER_CHECK_AUTH,
      method: "GET",
      fields: []
    },
    
    userDetails: {
      name: "Get User Details",
      endpoint: API_ENDPOINTS.USER_DETAILS,
      method: "GET",
      fields: []
    },
    
    language: {
      name: "User Language",
      endpoint: API_ENDPOINTS.USER_LANGUAGE,
      method: "POST",
      fields: ["language"]
    },
    
    logout: {
      name: "User Logout",
      endpoint: API_ENDPOINTS.USER_LOGOUT,
      method: "POST",
      fields: []
    }
  };
  
  const tester = new FuzzTester(customUrl);
  
  try {
    if (scenario) {
      console.log(`🔍 Running scenario: ${scenario}`);
      const result = await tester.runScenario(scenario, testScenarios);
      tester.generateReport([result]);
    } else {
      console.log("🔍 Running all scenarios");
      const results = await tester.runAllScenarios(testScenarios);
      tester.generateReport(results);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("📋 Stack trace:", error.stack);
    process.exit(1);
  }
}

// Run the main function
main();

export { FuzzTester, fuzzGenerators };
