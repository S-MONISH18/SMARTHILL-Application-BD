# Migration from AWS SDK to API-Based Architecture

## What Changed

### ❌ BEFORE (Broken)
```javascript
// dynamodbService.js - Direct AWS SDK (causes Metro crash)
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ ... });
```

**Problems:**
1. AWS SDK packages not installed → Module resolution fails
2. AWS SDK doesn't work in React Native → Compatibility issues
3. Requires AWS credentials in frontend → Security risk
4. Metro bundler crashes → App won't run

---

### ✅ AFTER (Working)
```javascript
// dynamodbService.js - API Service Layer (clean fetch calls)
const BASE_URL = 'http://10.0.2.2:3000';

export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return await response.json();
};
```

**Benefits:**
1. ✅ No external dependencies required
2. ✅ Works perfectly in React Native
3. ✅ Credentials stay on backend (secure)
4. ✅ Metro bundler works fine
5. ✅ Easy to test with Postman
6. ✅ Can switch databases without changing frontend code

---

## Architecture

### OLD FLOW (Broken)
```
React Native App
    ↓
dynamodbService.js (AWS SDK)
    ↓
❌ Module not found: @aws-sdk/client-dynamodb
    ↓
Metro crash 💥
```

### NEW FLOW (Working)
```
React Native App
    ↓
dynamodbService.js (Fetch API)
    ↓
http://10.0.2.2:3000 (Backend)
    ↓
server.js (Express)
    ↓
In-memory storage (demo)
    ↓
Response → App works ✅
```

---

## Files Modified

### 1. `apphill/src/services/dynamodbService.js`
**Before:** 470 lines of AWS SDK code
**After:** Clean API service with fetch calls
**Status:** ✅ Ready to use

### 2. `apphill/src/screens/auth/SignupScreen.js`
**Import:** Still imports from `dynamodbService.js`
**Change:** Now calls API endpoint (not AWS SDK)
**Status:** ✅ Works without errors

### 3. `apphill/server.js` (NEW)
**Purpose:** Express backend server
**Features:**
- User signup/login
- Product management
- Tractor management
- Order/booking handling
- Farm data storage
- In-memory database (demo)
**Status:** ✅ Ready to run

### 4. `BACKEND_SETUP.md` (NEW)
**Purpose:** Complete setup guide
**Contains:**
- Installation steps
- How to run the server
- API endpoint documentation
- Troubleshooting guide
**Status:** ✅ Reference document

---

## Next Phase: DynamoDB Integration

When you're ready to use DynamoDB (after testing with Express):

**Option 1: Local Testing with Express**
```javascript
// server.js with MongoDB/PostgreSQL
const mongoose = require('mongoose');

app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ success: true });
});
```

**Option 2: AWS Lambda + DynamoDB**
```javascript
// AWS Lambda function
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  await dynamodb.put({
    TableName: 'Users',
    Item: { ...event.body }
  }).promise();
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
```

**Option 3: AWS Amplify Backend**
```bash
amplify init
amplify add api
amplify add database
amplify push
```

---

## Quick Start

1. **Install backend dependencies:**
   ```bash
   cd /home/monish/Downloads/appHILL/apphill
   npm install express cors
   ```

2. **Start the server:**
   ```bash
   node server.js
   ```

3. **Run Metro:**
   ```bash
   npx react-native start --reset-cache
   ```

4. **Run Android app:**
   ```bash
   npm run android
   ```

✅ App should now work without any module errors!

---

## Why This Works

| Aspect | AWS SDK | API Service |
|--------|---------|-------------|
| React Native Compatible | ❌ | ✅ |
| npm install required | ❌ | ✅ |
| Credentials in frontend | ❌ | ✅ |
| Metro crash | ❌ | ✅ |
| Easy to test | ❌ | ✅ |
| Flexible backend | ❌ | ✅ |

---

## FAQ

**Q: Will my SignupScreen still work?**
A: Yes! Same import, same function calls. Only the implementation changed (AWS SDK → Fetch API).

**Q: Do I need to change app code?**
A: No! The API service is a drop-in replacement.

**Q: What about AWS DynamoDB?**
A: Later! First get the app running with Express. Then add DynamoDB to backend.

**Q: Is this production-ready?**
A: No. Current server has in-memory storage. Use MongoDB/PostgreSQL for real data.

**Q: How do I migrate to AWS?**
A: Replace `server.js` with AWS Lambda functions. Frontend code stays the same!
