# User Fuzz Testing Suite

A comprehensive security testing tool for the IM-CONNECTED application's user endpoints.

## Overview

The fuzz testing suite tests user endpoints with various malformed inputs to identify potential security vulnerabilities. It specifically avoids routes that would populate the database.

## Quick Start

```bash
# Test all user endpoints
npm run fuzz:test

# Test login endpoint only
npm run fuzz:test:login

# Test preferences endpoint only
npm run fuzz:test:preferences

# Detailed output
npm run fuzz:test:verbose
```

## What Gets Tested

### ✅ Safe Endpoints (Tested)
- `POST /api/v1/user` - Login
- `POST /api/v1/user/preferences` - User preferences
- `GET /api/v1/user/check-auth` - Authentication check
- `GET /api/v1/user/userDetails` - User details
- `POST /api/v1/user/language` - Language settings
- `POST /api/v1/user/logout` - Logout

### ❌ Avoided Endpoints (Database-Safe)
- `POST /api/v1/user/signup` - Creates users
- `POST /api/v1/post/create` - Creates posts
- `POST /api/v1/medication/medications` - Creates records
- `POST /api/v1/comment/create` - Creates comments

## Security Test Categories

### 1. SQL Injection
- `'; DROP TABLE users; --`
- `' OR '1'='1`
- `' UNION SELECT * FROM users --`

### 2. Cross-Site Scripting (XSS)
- `<script>alert('XSS')</script>`
- `<img src=x onerror=alert('XSS')>`
- `javascript:alert('XSS')`

### 3. NoSQL Injection
- `{"$gt": ""}`
- `{"$ne": null}`
- `{"$where": "1==1"}`

### 4. Buffer Overflow
- Long strings (1000+ characters)
- Memory exhaustion attempts

### 5. Special Characters
- Unicode characters
- Emojis
- Special symbols

### 6. Edge Cases
- Empty values
- Null/undefined
- Extreme numbers
- Type confusion

## Understanding Results

### ✅ Good Results (All Tests "Fail")
```
Total Tests: 64
✅ Passed: 0
❌ Failed: 64
⚠️  Errors: 0

🛡️  SECURITY STATUS: All attacks blocked successfully!
```

**This means your security is working perfectly!** All malicious inputs are being rejected.

### ❌ Bad Results (Some Tests "Pass")
```
Total Tests: 64
✅ Passed: 5
❌ Failed: 59
⚠️  Errors: 0

🚨 SECURITY WARNING: Some attacks succeeded!
```

**This would indicate security vulnerabilities** that need immediate attention.

## Advanced Usage

### Custom API Endpoint
```bash
node scripts/fuzzTest.js --url=http://localhost:3000
```

### Programmatic Usage
```javascript
import { FuzzTester } from './scripts/fuzzTest.js';

const tester = new FuzzTester('http://localhost:5001');
const results = await tester.runScenario('login');
console.log(results);
```

## File Structure

```
scripts/
└── fuzzTest.js               # Complete fuzz testing suite

docs/
└── FUZZ_TESTING.md           # This documentation
```

## Security Best Practices

1. **Run regularly** - Test after any code changes
2. **Monitor results** - All tests should "fail" (be blocked)
3. **Review logs** - Check server logs for attempted attacks
4. **Update payloads** - Keep test data current with new attack vectors
5. **Document findings** - Record any security issues found

## Troubleshooting

### Server Not Running
```
❌ Error: Failed to parse URL from /api/v1/user
```
**Solution**: Start your backend server with `npm run start`

### Import Errors
```
❌ Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```
**Solution**: Ensure you're using Node.js 14+ and the file paths are correct

### All Tests Pass (Security Issue)
```
✅ Passed: 64
```
**Solution**: This indicates a serious security vulnerability - review your input validation immediately

## Contributing

To add new test scenarios or fuzz generators, edit `scripts/fuzzTest.js`:

1. Add new generators to `fuzzGenerators` object
2. Add new scenarios to `testScenarios` object
3. Test with `npm run fuzz:test`

## License

This fuzz testing suite is part of the IM-CONNECTED project.
