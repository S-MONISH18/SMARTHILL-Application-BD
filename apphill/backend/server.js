console.log("🔥 RUNNING FILE:", __filename);

const express = require('express');
const cors = require('cors');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');

const app = express();

//////////////////////////////////////////////////////
// 🔥 GLOBAL DEBUG
//////////////////////////////////////////////////////
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

//////////////////////////////////////////////////////
// 🔥 TEST ROUTE
//////////////////////////////////////////////////////
app.get('/test', (req, res) => {
  res.send('SERVER OK');
});

//////////////////////////////////////////////////////
// ✅ AWS CONFIG
//////////////////////////////////////////////////////
const client = new DynamoDBClient({
  region: 'ap-south-1',
});

const ddb = DynamoDBDocumentClient.from(client);

//////////////////////////////////////////////////////
// ✅ SIGNUP
//////////////////////////////////////////////////////
app.post('/signup', async (req, res) => {
  try {
    const user = req.body;

    const existing = await ddb.send(
      new GetCommand({
        TableName: 'Users',
        Key: { userId: user.phone },
      })
    );

    if (existing.Item) {
      return res.json({ success: false, message: 'User already exists' });
    }

    await ddb.send(
      new PutCommand({
        TableName: 'Users',
        Item: {
          userId: user.phone,
          name: user.name,
          phone: user.phone,
          password: user.password,
          role: user.role,
          createdAt: new Date().toISOString(),
        },
      })
    );

    res.json({ success: true, message: 'User created' });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// ✅ LOGIN
//////////////////////////////////////////////////////
app.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const result = await ddb.send(
      new GetCommand({
        TableName: 'Users',
        Key: { userId: phone },
      })
    );

    if (!result.Item) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (result.Item.password !== password) {
      return res.json({ success: false, message: 'Wrong password' });
    }

    res.json({ success: true, user: result.Item });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🚜 REGISTER TRACTOR
//////////////////////////////////////////////////////
app.post('/register-tractor', async (req, res) => {
  try {
    const tractor = req.body;

    if (!tractor.model || !tractor.number || !tractor.ownerPhone) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const tractorId = Date.now().toString();

    await ddb.send(
      new PutCommand({
        TableName: 'Tractors',
        Item: {
          tractorId,
          ownerPhone: tractor.ownerPhone,
          model: tractor.model,
          number: tractor.number,
          location: tractor.location,
          dailyRate: tractor.dailyRate,
          status: tractor.status || 'Available',
          createdAt: new Date().toISOString(),
        },
      })
    );

    res.json({ success: true, message: 'Tractor registered' });
  } catch (err) {
    console.error("🔥 REGISTER TRACTOR ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🚜 GET OWNER TRACTORS
//////////////////////////////////////////////////////
app.get('/tractors/:phone', async (req, res) => {
  try {
    const data = await ddb.send(
      new ScanCommand({
        TableName: 'Tractors',
        FilterExpression: 'ownerPhone = :p',
        ExpressionAttributeValues: { ':p': req.params.phone },
      })
    );

    res.json({ success: true, data: data.Items || [] });
  } catch (err) {
    console.error("🔥 GET TRACTORS ERROR:", err);
    res.json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🚜 BOOK TRACTOR
//////////////////////////////////////////////////////
app.post('/book-tractor', async (req, res) => {
  try {
    const booking = req.body;

    if (!booking.tractorModel || !booking.ownerName) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const bookingId = Date.now().toString();

    await ddb.send(
      new PutCommand({
        TableName: 'Bookings',
        Item: {
          bookingId,
          tractorModel: booking.tractorModel,
          ownerName: booking.ownerName,
          farmerPhone: booking.farmerPhone,
          fromDate: booking.fromDate,
          toDate: booking.toDate,
          hours: booking.hours,
          total: booking.total,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      })
    );

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 BOOK ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🛒 BUY PRODUCT (FIXED)
//////////////////////////////////////////////////////
app.post('/buy-product', async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const order = req.body;

    // ✅ VALIDATION
    if (!order.productName || !order.farmerName || !order.buyerPhone) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId = Date.now().toString();

    await ddb.send(
      new PutCommand({
        TableName: 'Orders',
        Item: {
          orderId,
          productName: order.productName,
          farmerName: order.farmerName,
          buyerPhone: order.buyerPhone,
          quantity: order.quantity || "N/A",
          price: order.price || "0",
          status: 'Pending',
          createdAt: new Date().toISOString(),
        },
      })
    );

    // 🔔 Notification
    await ddb.send(
      new PutCommand({
        TableName: 'Notifications',
        Item: {
          notificationId: Date.now().toString(),
          userId: order.farmerName,
          message: `🛒 New order for ${order.productName}`,
          createdAt: new Date().toISOString(),
        },
      })
    );

    res.json({
      success: true,
      message: 'Order placed',
    });
  } catch (err) {
    console.error("🔥 BUY PRODUCT ERROR:", err);
    res.json({
      success: false,
      error: err.message,
    });
  }
});

//////////////////////////////////////////////////////
// 📦 CUSTOMER ORDERS
//////////////////////////////////////////////////////
app.get('/orders/:phone', async (req, res) => {
  try {
    const data = await ddb.send(
      new ScanCommand({
        TableName: 'Orders',
        FilterExpression: 'buyerPhone = :p',
        ExpressionAttributeValues: { ':p': req.params.phone },
      })
    );

    res.json({ success: true, data: data.Items });
  } catch (err) {
    console.error("🔥 ORDERS ERROR:", err);
    res.json({ success: false });
  }
});

//////////////////////////////////////////////////////
// 🔔 NOTIFICATIONS
//////////////////////////////////////////////////////
app.get('/notifications/:userId', async (req, res) => {
  try {
    const data = await ddb.send(
      new ScanCommand({
        TableName: 'Notifications',
        FilterExpression: 'userId = :u',
        ExpressionAttributeValues: { ':u': req.params.userId },
      })
    );

    res.json({ success: true, data: data.Items });
  } catch (err) {
    console.error("🔥 NOTIFICATION ERROR:", err);
    res.json({ success: false });
  }
});

//////////////////////////////////////////////////////
// 🚀 START SERVER
//////////////////////////////////////////////////////
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});