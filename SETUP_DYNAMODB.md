# SmartHill DynamoDB Setup Guide

## Overview
This guide will help you set up AWS DynamoDB for the SmartHill application. DynamoDB will store all your farm data, products, users, orders, and more.

---

## Prerequisites
- AWS Account (create at https://aws.amazon.com)
- Node.js installed
- React Native project (apphill)

---

## Step 1: Create AWS Account and IAM User

### 1.1 Create AWS Account
Visit https://aws.amazon.com and create a free account.

### 1.2 Create IAM User
```
AWS Console → IAM → Users → Create User
- Username: smarthill-dev
- Check "Access key - Programmatic access"
- Click Next
```

### 1.3 Set Permissions
```
Attach Policies:
- AmazonDynamoDBFullAccess
- AmazonS3FullAccess
- CloudWatchLogsFullAccess
- CloudWatchMetricsFullAccess
```

### 1.4 Save Credentials
```
Download CSV with:
- Access Key ID
- Secret Access Key
KEEP THIS SAFE! Don't share these credentials.
```

---

## Step 2: Install AWS SDK

```bash
cd apphill

# Install AWS SDK v3 for React Native
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb @aws-amplify/core aws-amplify

# For Expo projects
expo install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb aws-amplify
```

---

## Step 3: Create DynamoDB Tables

### Option A: Using AWS Management Console

1. **Go to DynamoDB Dashboard**
   - AWS Console → DynamoDB → Tables → Create Table

2. **Create "Users" Table**
   ```
   Table Name: Users
   Primary Key (Partition): userId (String)
   Backup: Optional
   Click Create
   ```

3. **Create "FarmData" Table**
   ```
   Table Name: FarmData
   Primary Key (Partition): farmId (String)
   Sort Key: timestamp (Number)
   Click Create
   ```

4. **Create "Products" Table**
   ```
   Table Name: Products
   Primary Key (Partition): productId (String)
   Click Create
   ```

5. **Create "Orders" Table**
   ```
   Table Name: Orders
   Primary Key (Partition): orderId (String)
   Click Create
   ```

6. **Create "Tractors" Table**
   ```
   Table Name: Tractors
   Primary Key (Partition): tractorId (String)
   Click Create
   ```

7. **Create "Bookings" Table**
   ```
   Table Name: Bookings
   Primary Key (Partition): bookingId (String)
   Click Create
   ```

8. **Create "Notifications" Table**
   ```
   Table Name: Notifications
   Primary Key (Partition): userId (String)
   Sort Key: timestamp (Number)
   Click Create
   ```

9. **Create "Reviews" Table**
   ```
   Table Name: Reviews
   Primary Key (Partition): reviewId (String)
   Click Create
   ```

### Option B: Using AWS CLI

```bash
# Create Users table
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create FarmData table
aws dynamodb create-table \
  --table-name FarmData \
  --attribute-definitions \
    AttributeName=farmId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=farmId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create Products table
aws dynamodb create-table \
  --table-name Products \
  --attribute-definitions AttributeName=productId,AttributeType=S \
  --key-schema AttributeName=productId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create Orders table
aws dynamodb create-table \
  --table-name Orders \
  --attribute-definitions AttributeName=orderId,AttributeType=S \
  --key-schema AttributeName=orderId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create Tractors table
aws dynamodb create-table \
  --table-name Tractors \
  --attribute-definitions AttributeName=tractorId,AttributeType=S \
  --key-schema AttributeName=tractorId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create Bookings table
aws dynamodb create-table \
  --table-name Bookings \
  --attribute-definitions AttributeName=bookingId,AttributeType=S \
  --key-schema AttributeName=bookingId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create Notifications table
aws dynamodb create-table \
  --table-name Notifications \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1

# Create Reviews table
aws dynamodb create-table \
  --table-name Reviews \
  --attribute-definitions AttributeName=reviewId,AttributeType=S \
  --key-schema AttributeName=reviewId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-south-1
```

---

## Step 4: Configure Environment Variables

### 4.1 Copy .env.example
```bash
cp .env.example .env.local
```

### 4.2 Edit .env.local
```
REACT_APP_AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_from_iam
AWS_SECRET_ACCESS_KEY=your_secret_key_from_iam
REACT_APP_S3_BUCKET=smarthill-storage
```

### 4.3 Add to .gitignore
```bash
echo ".env.local" >> .gitignore
```

---

## Step 5: Use DynamoDB in Your Code

### Example 1: Save User
```javascript
import { createUser } from '../../services/dynamodbService';

const handleSignup = async () => {
  const result = await createUser({
    userId: 'user-001',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '9876543210',
    role: 'farmer'
  });
  
  if (result.success) {
    alert('User created successfully!');
  }
};
```

### Example 2: Get Farm Data
```javascript
import { getFarmDataRecent } from '../../services/dynamodbService';

useEffect(() => {
  const loadData = async () => {
    const result = await getFarmDataRecent('farm-001', 50);
    if (result.success) {
      setFarmData(result.data);
    }
  };
  
  loadData();
}, []);
```

### Example 3: Save Product
```javascript
import { createProduct } from '../../services/dynamodbService';

const handleCreateProduct = async () => {
  const result = await createProduct({
    farmerId: 'farmer-001',
    productName: 'Organic Tomatoes',
    category: 'Vegetables',
    quantity: 100,
    pricePerUnit: 25
  });
  
  if (result.success) {
    console.log('Product created:', result.productId);
  }
};
```

---

## Step 6: Test Your Setup

### 6.1 Create Test File
Create `src/services/__tests__/dynamodb.test.js`:

```javascript
import {
  createUser,
  getUser,
  saveFarmData,
  getFarmDataRecent
} from '../dynamodbService';

export const testDynamoDB = async () => {
  console.log('🧪 Testing DynamoDB...');
  
  try {
    // Test 1: Create User
    console.log('Test 1: Creating user...');
    const userResult = await createUser({
      userId: `test-user-${Date.now()}`,
      name: 'Test Farmer',
      email: 'test@example.com',
      phone: '9876543210',
      role: 'farmer'
    });
    console.log('✅ User created:', userResult);
    
    // Test 2: Get User
    console.log('Test 2: Getting user...');
    const getResult = await getUser(userResult.userId);
    console.log('✅ User retrieved:', getResult);
    
    // Test 3: Save Farm Data
    console.log('Test 3: Saving farm data...');
    const farmResult = await saveFarmData({
      farmId: 'test-farm-001',
      nodeId: 'node-1',
      temperature: 28.5,
      humidity: 65,
      soilPH: 6.8
    });
    console.log('✅ Farm data saved:', farmResult);
    
    // Test 4: Get Farm Data
    console.log('Test 4: Getting farm data...');
    const dataResult = await getFarmDataRecent('test-farm-001', 10);
    console.log('✅ Farm data retrieved:', dataResult);
    
    console.log('✅ All tests passed!');
    return { success: true };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error };
  }
};
```

### 6.2 Run Test
```javascript
// In your LoginScreen or debug screen
import { testDynamoDB } from '../../services/__tests__/dynamodb.test';

const handleTest = async () => {
  const result = await testDynamoDB();
  console.log(result);
};
```

---

## Step 7: Monitor and Debug

### View DynamoDB Data
```
AWS Console → DynamoDB → Tables → [Your Table] → Items
```

### Enable CloudWatch Logs
```
AWS Console → CloudWatch → Logs
```

### Monitor Costs
```
AWS Console → Billing Dashboard
```

---

## Pricing (Estimated)

| Operation | Cost |
|-----------|------|
| 1M read units | $0.25 |
| 1M write units | $1.00 |
| Storage | $0.25/GB/month |
| **Monthly estimate** | **$5-50** |
| **Free tier** | 25GB storage |

---

## Production Best Practices

1. **Use AWS Cognito for Authentication**
   - Not hardcoded API keys
   - Temporary credentials

2. **Enable Encryption**
   ```
   Table Settings → Encryption → Enable
   ```

3. **Set Up Backups**
   ```
   Backups → Create backup automatically
   ```

4. **Enable Point-in-Time Recovery**
   ```
   Backups → Enable PITR
   ```

5. **Set Up Alarms**
   ```
   CloudWatch → Alarms → Create Alarm
   ```

6. **Use IAM Roles**
   - Never embed credentials in app
   - Use temporary STS tokens

7. **Enable VPC Endpoint**
   - Private connection to DynamoDB
   - No internet traffic

---

## Troubleshooting

### Error: "User: arn:aws:iam::... is not authorized"
**Solution:** Check IAM permissions, add DynamoDBFullAccess policy

### Error: "Requested resource not found"
**Solution:** Table doesn't exist, create tables using CLI or Console

### Error: "ProvisionedThroughput exceeded"
**Solution:** Increase table capacity or use PAY_PER_REQUEST billing

### Slow Read/Write
**Solution:** 
1. Check table capacity
2. Use indexes for frequent queries
3. Check network latency

---

## Next Steps

1. ✅ Create AWS account
2. ✅ Create IAM user
3. ✅ Install AWS SDK
4. ✅ Create DynamoDB tables
5. ✅ Configure environment variables
6. ✅ Test with sample data
7. ✅ Integrate into screens
8. ✅ Monitor with AWS Console
9. ⬜ Add Lambda functions for complex logic
10. ⬜ Set up API Gateway
11. ⬜ Deploy to production

---

## Support & Resources

- AWS DynamoDB Docs: https://docs.aws.amazon.com/dynamodb/
- AWS SDK for JavaScript: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
- AWS Amplify: https://aws.amazon.com/amplify/
- Pricing Calculator: https://calculator.aws/

---

## Need Help?

1. Check AWS CloudWatch logs
2. Review IAM permissions
3. Test connectivity with test script
4. Contact AWS Support (paid plans)

Happy coding! 🚀
