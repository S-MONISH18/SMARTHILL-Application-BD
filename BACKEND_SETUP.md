# Backend Server Setup Guide

This guide helps you set up and run the Express backend server for the SmartHill app.

## What We've Done

✅ Converted `dynamodbService.js` to API-based service (no AWS SDK)
✅ Created `server.js` - simple Express backend
✅ Updated `SignupScreen.js` to use the API service

## Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd /home/monish/Downloads/appHILL/apphill
npm install express cors
```

### Step 2: Start the Backend Server

```bash
node server.js
```

**Expected Output:**
```
Server running on port 3000
Android emulator can access at: http://10.0.2.2:3000
Physical device can access at: http://YOUR_COMPUTER_IP:3000
```

### Step 3: Verify Backend is Running

Open another terminal and test:
```bash
curl http://localhost:3000/health
```

Should return: `{"success":true,"message":"Server is running"}`

## Running the Full Stack

### Terminal 1: Backend Server
```bash
cd /home/monish/Downloads/appHILL/apphill
node server.js
```

### Terminal 2: Metro Bundler
```bash
cd /home/monish/Downloads/appHILL/apphill
npx react-native start --reset-cache
```

### Terminal 3: Android App
```bash
cd /home/monish/Downloads/appHILL/apphill
npm run android
```

## API Endpoints Available

### User Management
- `POST /signup` - Create new user
- `POST /login` - User login
- `GET /user/:userId` - Get user details
- `PUT /user/:userId` - Update user

### Products
- `POST /products` - Create product
- `GET /products` - Get all products
- `GET /products/:productId` - Get specific product
- `PUT /products/:productId` - Update product
- `GET /farmer/:farmerId/products` - Get farmer's products

### Tractors
- `POST /tractors` - Register tractor
- `GET /tractors` - Get all tractors
- `GET /tractors/available` - Get available tractors
- `GET /tractors/:tractorId` - Get specific tractor

### Orders & Bookings
- `POST /orders` - Create order
- `GET /orders/:orderId` - Get order
- `PUT /orders/:orderId/status` - Update order status
- `POST /bookings` - Create booking
- `GET /bookings/:bookingId` - Get booking

### Farm Data
- `POST /farm-data` - Save farm data
- `GET /farm-data/:farmId` - Get farm data

## Key Points

⚠️ **Important for Android Emulator:**
- Use `http://10.0.2.2:3000` (not localhost/127.0.0.1)
- This is already configured in `dynamodbService.js`

🔒 **Security Notes (For Production):**
- Passwords are stored in plain text (demo only)
- No authentication tokens
- No database - data is in memory (lost on server restart)
- Use proper database (MongoDB, PostgreSQL) instead

## Next Steps (After Testing)

When backend is working with the app:

1. **Add Database** - MongoDB or PostgreSQL
2. **Add JWT Authentication** - Secure API calls
3. **Add DynamoDB Integration** - For AWS deployment
4. **Deploy to AWS** - Lambda + DynamoDB

## Troubleshooting

**Port already in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it (if needed)
kill -9 <PID>
```

**Metro still showing errors:**
```bash
# Restart with cache reset
npx react-native start --reset-cache
```

**App can't reach server:**
- Verify server is running (check terminal for "Server running on port 3000")
- Check firewall settings
- For physical device: use your computer's local IP instead of 10.0.2.2
  - Find IP: `ipconfig getifaddr en0` (Mac) or `hostname -I` (Linux)
  - Update `BASE_URL` in `dynamodbService.js`

---

✅ Once backend is running and app connects successfully, you'll see:
- Signup working
- Login working
- Products loading
- Tractors loading
- No MetroBundle errors
