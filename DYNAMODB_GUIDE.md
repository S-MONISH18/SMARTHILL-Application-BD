# AWS DynamoDB Integration Guide for SmartHill

## What is DynamoDB?
AWS DynamoDB is a fully managed, serverless NoSQL database that stores data as JSON documents. It's perfect for mobile apps like React Native.

---

## Use Cases for SmartHill Application

### 1. **User Accounts & Authentication**
**Primary Key**: `userId`
**Data to Store**:
- User credentials (phone, email, password hash)
- User profile (name, location, role)
- Account settings preferences
- Subscription plans

```json
{
  "userId": "farmer-001",
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "phone": "9876543210",
  "role": "farmer",
  "location": "Karnataka",
  "joinDate": "2024-01-15",
  "profileComplete": 75,
  "timestamp": 1711270800
}
```

---

### 2. **Farm Data (Most Important)**
**Primary Key**: `farmId`
**Sort Key**: `timestamp`
**Real-time Data**:
- Sensor readings (temperature, humidity, soil pH)
- Node data
- Motor/valve status
- Water level, light exposure
- Daily updates

```json
{
  "farmId": "farm-001",
  "timestamp": 1711270800,
  "nodeId": "node-1",
  "temperature": 28.5,
  "humidity": 65,
  "soilPH": 6.8,
  "waterLevel": 85,
  "light": "Medium",
  "motorStatus": "ON",
  "valveStatus": "CLOSED"
}
```

---

### 3. **Products & Inventory**
**Primary Key**: `productId`
**Data to Store**:
- Product name, category, quantity
- Price, description
- Farmer seller info
- Available stock
- Product images URLs

```json
{
  "productId": "prod-001",
  "farmerId": "farmer-001",
  "productName": "Organic Tomatoes",
  "category": "Vegetables",
  "quantity": 100,
  "unit": "kg",
  "pricePerUnit": 25,
  "description": "Fresh organic tomatoes",
  "imageUrl": "s3://smarthill/products/tomatoes.jpg",
  "availableFrom": "2024-03-25",
  "createdAt": 1711270800
}
```

---

### 4. **Tractor Rentals**
**Primary Key**: `tractorId`
**Data to Store**:
- Tractor details (model, HP, fuel type)
- Owner info
- Rental rates
- Booking status
- Availability calendar

```json
{
  "tractorId": "tractor-001",
  "ownerId": "owner-001",
  "model": "Mahindra 575 DI",
  "registrationNumber": "TN-36K-8077",
  "horsepower": 47,
  "fuelType": "Diesel",
  "rentalRatePerDay": 500,
  "rentalRatePerHour": 60,
  "isAvailable": true,
  "location": "Tamil Nadu",
  "totalBookings": 12,
  "rating": 4.8
}
```

---

### 5. **Orders & Transactions**
**Primary Key**: `orderId`
**Data to Store**:
- Order details (buyer, seller, product)
- Order status
- Price and payment
- Delivery info
- Timestamps

```json
{
  "orderId": "order-001",
  "customerId": "customer-001",
  "productId": "prod-001",
  "farmerId": "farmer-001",
  "quantity": 20,
  "pricePerUnit": 25,
  "totalPrice": 500,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "deliveryAddress": "Bangalore",
  "createdAt": 1711270800
}
```

---

### 6. **Booking Records**
**Primary Key**: `bookingId`
**Data to Store**:
- Rental bookings
- From/to dates
- Customer & tractor info
- Payment status
- Rating & reviews

```json
{
  "bookingId": "booking-001",
  "customerId": "customer-001",
  "tractorId": "tractor-001",
  "fromDate": "2024-03-25T08:00:00Z",
  "toDate": "2024-03-27T08:00:00Z",
  "totalHours": 48,
  "totalAmount": 2880,
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "createdAt": 1711270800
}
```

---

### 7. **Notifications & Messages**
**Primary Key**: `userId`
**Sort Key**: `timestamp`
**Data to Store**:
- Alerts for farm data thresholds
- Order updates
- Booking reminders
- System notifications

```json
{
  "userId": "farmer-001",
  "timestamp": 1711270800,
  "type": "alert",
  "title": "Water Level Critical",
  "message": "Water level dropped to 15% in Node 2",
  "read": false,
  "actionUrl": "/farm/node-2"
}
```

---

### 8. **Reviews & Ratings**
**Primary Key**: `reviewId`
**Data to Store**:
- Product/tractor reviews
- Ratings (1-5 stars)
- Reviewer info
- Review timestamp

```json
{
  "reviewId": "review-001",
  "productId": "prod-001",
  "customerId": "customer-001",
  "rating": 5,
  "title": "Excellent Quality",
  "comment": "Fresh and organic tomatoes, highly recommended",
  "createdAt": 1711270800
}
```

---

## DynamoDB Tables Summary

| Table Name | Primary Key | Sort Key | Use Case |
|-----------|------------|----------|----------|
| Users | userId | - | User profiles & accounts |
| FarmData | farmId | timestamp | Sensor & farm readings |
| Products | productId | - | Farm products |
| Tractors | tractorId | - | Tractor listings |
| Orders | orderId | - | Purchase orders |
| Bookings | bookingId | - | Tractor bookings |
| Notifications | userId | timestamp | User alerts |
| Reviews | reviewId | - | Ratings & reviews |

---

## Step 1: Setup AWS DynamoDB

### Create Tables in AWS Console

```bash
# You can also use AWS CLI
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

---

## Step 2: Install AWS SDK for React Native

```bash
cd apphill
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb aws-amplify
```

---

## Step 3: Configure AWS Credentials

Create `awsConfig.js`:

```javascript
import { initializeApp } from 'aws-amplify';

const awsConfig = {
  region: 'ap-south-1', // or your preferred region
  credentials: {
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY'
  }
};

initializeApp(awsConfig);
export default awsConfig;
```

---

## Step 4: Create DynamoDB Service

Create `src/services/dynamodbService.js`:

```javascript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Create User
export const createUser = async (userData) => {
  try {
    await docClient.send(new PutCommand({
      TableName: 'Users',
      Item: userData
    }));
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error };
  }
};

// Get User
export const getUser = async (userId) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: 'Users',
      Key: { userId }
    }));
    return { success: true, data: result.Item };
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error };
  }
};

// Query Farm Data
export const getFarmData = async (farmId) => {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: 'FarmData',
      KeyConditionExpression: 'farmId = :farmId',
      ExpressionAttributeValues: {
        ':farmId': farmId
      },
      ScanIndexForward: false, // Latest first
      Limit: 100
    }));
    return { success: true, data: result.Items };
  } catch (error) {
    console.error('Error fetching farm data:', error);
    return { success: false, error };
  }
};

// Create Product
export const createProduct = async (productData) => {
  try {
    await docClient.send(new PutCommand({
      TableName: 'Products',
      Item: productData
    }));
    return { success: true };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error };
  }
};

// Get All Products (Scan)
export const getAllProducts = async () => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: 'Products'
    }));
    return { success: true, data: result.Items };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error };
  }
};

// Save Notification
export const saveNotification = async (notification) => {
  try {
    await docClient.send(new PutCommand({
      TableName: 'Notifications',
      Item: {
        ...notification,
        timestamp: Date.now()
      }
    }));
    return { success: true };
  } catch (error) {
    console.error('Error saving notification:', error);
    return { success: false, error };
  }
};
```

---

## Step 5: Use in Your Components

Example in `FarmerDashboardScreen.js`:

```javascript
import { createProduct, getFarmData } from '../../services/dynamodbService';

export default function FarmerDashboardScreen() {
  const [farmData, setFarmData] = useState([]);

  useEffect(() => {
    loadFarmData();
  }, []);

  const loadFarmData = async () => {
    const result = await getFarmData('farm-001');
    if (result.success) {
      setFarmData(result.data);
    }
  };

  return (
    // Your UI here
  );
}
```

---

## Key Benefits for SmartHill

✅ **Real-time Updates** - Store sensor data instantly
✅ **Scalable** - Handles millions of records
✅ **Serverless** - No server management
✅ **Cost-effective** - Pay per operation
✅ **Mobile-friendly** - Offline capabilities with Amplify
✅ **Secure** - AWS manages security
✅ **Global** - Data replicated globally
✅ **Auto-scaling** - Handles traffic spikes

---

## Next Steps

1. ✅ Create AWS Account
2. ✅ Set up IAM User with DynamoDB permissions
3. ✅ Create DynamoDB tables
4. ✅ Install AWS SDK
5. ✅ Implement services
6. ✅ Add data operations to screens
7. ✅ Test with real data
8. ✅ Deploy to production

---

## Cost Estimate

- **On-Demand Pricing**: $0.25 per million read units, $1 per million write units
- **Estimated Monthly**: $10-50 USD for small app
- **Free Tier**: 25 GB storage, good for testing

---

## Security Best Practices

1. Never hardcode AWS keys
2. Use IAM roles instead
3. Enable encryption at rest
4. Set up access control per table
5. Use VPC endpoints for private access
6. Monitor with CloudWatch

---

## Questions?

For more help, create AWS Lambda functions for backend operations:
- Authentication
- Payment processing
- Notifications
- Data aggregation

This gives you a complete backend without managing servers!
