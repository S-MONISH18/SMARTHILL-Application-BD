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
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const app = express();

// 🧠 Developer fallback data store (local memory) when DynamoDB is inaccessible
const inMemoryUsers = [];
const inMemoryProducts = [];
const inMemoryOrders = [];
const inMemoryBookings = [];
const inMemoryNotifications = [];

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
    console.log('📝 SIGNUP REQUEST:', user);

    let existing;
    try {
      existing = await ddb.send(
        new GetCommand({
          TableName: 'Users',
          Key: { userId: user.phone },
        })
      );
    } catch (ddbError) {
      console.error('🔥 SIGNUP DYNAMODB ERROR, fallback in-memory', ddbError);
      existing = { Item: inMemoryUsers.find((u) => u.userId === user.phone) };
    }

    if (existing.Item) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const userItem = {
      userId: user.phone,
      name: user.name || user.phone,
      phone: user.phone,
      password: user.password,
      role: user.role,
      createdAt: new Date().toISOString(),
    };

    console.log('✅ USER ITEM TO STORE:', userItem);

    try {
      await ddb.send(
        new PutCommand({
          TableName: 'Users',
          Item: userItem,
        })
      );
    } catch (ddbError) {
      console.error('🔥 SIGNUP DYNAMODB ERROR, save in in-memory fallback', ddbError);
      inMemoryUsers.push(userItem);
    }

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

    let result;
    try {
      result = await ddb.send(
        new GetCommand({
          TableName: 'Users',
          Key: { userId: phone },
        })
      );
    } catch (ddbError) {
      console.error('🔥 LOGIN DYNAMODB ERROR, fallback in-memory', ddbError);
      result = { Item: inMemoryUsers.find((u) => u.userId === phone) };
    }

    if (!result.Item) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (result.Item.password !== password) {
      return res.json({ success: false, message: 'Wrong password' });
    }

    console.log('✅ LOGIN USER RETURNED:', result.Item);
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
          ownerName: tractor.ownerName || 'Unknown',
          model: tractor.model,
          number: tractor.number,
          location: tractor.location,
          hourlyRate: tractor.hourlyRate || '0',
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
app.get('/tractors', async (req, res) => {
  try {
    const data = await ddb.send(
      new ScanCommand({
        TableName: 'Tractors',
        FilterExpression: '#status = :s',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':s': 'Available' },
      })
    );

    res.json({ success: true, data: data.Items || [] });
  } catch (err) {
    console.error('🔥 GET AVAILABLE TRACTORS ERROR:', err);
    res.json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🛍 PRODUCTS
//////////////////////////////////////////////////////
app.post('/products', async (req, res) => {
  try {
    const product = req.body;

    if (!product.productName || !product.category || !product.price || !product.quantity || !product.farmerPhone) {
      return res.json({ success: false, message: 'Missing required product fields' });
    }

    const productId = Date.now().toString();

    const productItem = {
      productId,
      farmerName: product.farmerName || 'Unknown',
      farmerPhone: product.farmerPhone,
      productName: product.productName,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      location: product.location || '',
      description: product.description || '',
      createdAt: new Date().toISOString(),
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: 'Products',
          Item: productItem,
        })
      );
    } catch (ddbError) {
      console.error('🔥 ADD PRODUCT DYNAMODB ERROR, fallback in-memory', ddbError);
      inMemoryProducts.push(productItem);
    }

    res.json({ success: true, message: 'Product saved', productId });
  } catch (err) {
    console.error('🔥 ADD PRODUCT ERROR:', err);
    res.json({ success: false, error: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    let items = [];
    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Products',
        })
      );
      items = data.Items || [];
    } catch (ddbError) {
      console.error('🔥 GET PRODUCTS DYNAMODB ERROR, fallback in-memory', ddbError);
      items = inMemoryProducts;
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 GET PRODUCTS ERROR:', err);
    res.json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🚜 BOOK TRACTOR
//////////////////////////////////////////////////////
app.post('/book-tractor', async (req, res) => {
  try {
    const booking = req.body;
    console.log('🚀 BOOKING REQUEST RECEIVED:', JSON.stringify(booking, null, 2));

    if (!booking.tractorModel || !booking.ownerName || !booking.ownerPhone || !booking.farmerPhone) {
      console.log('❌ MISSING FIELDS:', {
        tractorModel: booking.tractorModel,
        ownerName: booking.ownerName,
        ownerPhone: booking.ownerPhone,
        farmerPhone: booking.farmerPhone,
      });
      return res.json({ success: false, message: "Missing fields (tractorModel, ownerName, ownerPhone, farmerPhone are required)" });
    }

    const bookingId = Date.now().toString();

    const bookingItem = {
      bookingId,
      tractorModel: booking.tractorModel,
      ownerName: booking.ownerName,
      ownerPhone: booking.ownerPhone,
      farmerPhone: booking.farmerPhone,
      farmerName: booking.farmerName && booking.farmerName.trim() ? booking.farmerName : 'Unknown Farmer',
      fromDate: booking.fromDate,
      toDate: booking.toDate,
      hours: booking.hours,
      total: booking.total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    console.log('✅ BOOKING ITEM TO SAVE:', JSON.stringify(bookingItem, null, 2));

    const notificationItem = {
      notificationId: Date.now().toString(),
      userId: booking.ownerPhone,
      message: `🚜 New booking request for ${booking.tractorModel} from ${booking.farmerName || booking.farmerPhone}`,
      createdAt: new Date().toISOString(),
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: 'Bookings',
          Item: bookingItem,
        })
      );

      await ddb.send(
        new PutCommand({
          TableName: 'Notifications',
          Item: notificationItem,
        })
      );
    } catch (ddbError) {
      console.error('🔥 BOOK TRACTOR DYNAMODB ERROR, fallback in-memory', ddbError);
      inMemoryBookings.push(bookingItem);
      inMemoryNotifications.push(notificationItem);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 BOOK ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// � TRACTOR BOOKINGS ENDPOINTS
//////////////////////////////////////////////////////
app.get('/bookings/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;

    let items = [];

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Bookings',
          FilterExpression: 'farmerPhone = :p',
          ExpressionAttributeValues: { ':p': phone },
        })
      );
      items = data.Items || [];
    } catch (ddbError) {
      console.error('🔥 BOOKINGS DYNAMODB ERROR, fallback in-memory', ddbError);
      items = inMemoryBookings.filter((b) => b.farmerPhone === phone);
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 BOOKINGS ERROR:', err);
    res.json({ success: false, data: [] });
  }
});

app.get('/owner-requests/:owner', async (req, res) => {
  try {
    const owner = req.params.owner;

    let items = [];

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Bookings',
          FilterExpression: 'ownerPhone = :o OR ownerName = :o',
          ExpressionAttributeValues: { ':o': owner },
        })
      );
      items = data.Items || [];
    } catch (ddbError) {
      console.error('🔥 OWNER REQUESTS DYNAMODB ERROR, fallback in-memory', ddbError);
      items = inMemoryBookings.filter(
        (b) => b.ownerPhone === owner || b.ownerName === owner
      );
    }

    console.log(`📥 OWNER REQUESTS FOR ${owner}:`, JSON.stringify(items, null, 2));
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 OWNER REQUESTS ERROR:', err);
    res.json({ success: false, data: [] });
  }
});

app.post('/update-booking', async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.json({ success: false, message: 'Missing bookingId or status' });
    }

    let updatedBooking = null;

    try {
      const result = await ddb.send(
        new UpdateCommand({
          TableName: 'Bookings',
          Key: { bookingId },
          UpdateExpression: 'SET #s = :status',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: { ':status': status },
          ReturnValues: 'ALL_NEW',
        })
      );

      updatedBooking = result.Attributes;
      if (updatedBooking) {
        await ddb.send(
          new PutCommand({
            TableName: 'Notifications',
            Item: {
              notificationId: Date.now().toString(),
              userId: updatedBooking.farmerPhone,
              message: `📣 Booking ${status}: ${updatedBooking.tractorModel}`,
              createdAt: new Date().toISOString(),
            },
          })
        );
      }
    } catch (ddbError) {
      console.error('🔥 UPDATE BOOKING DYNAMODB ERROR, fallback in-memory', ddbError);

      const booking = inMemoryBookings.find((b) => b.bookingId === bookingId);
      if (booking) {
        booking.status = status;
        updatedBooking = booking;
      }

      if (updatedBooking) {
        inMemoryNotifications.push({
          notificationId: Date.now().toString(),
          userId: updatedBooking.farmerPhone,
          message: `📣 Booking ${status}: ${updatedBooking.tractorModel}`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, message: 'Booking status updated' });
  } catch (err) {
    console.error('🔥 UPDATE BOOKING ERROR:', err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🗑️ DELETE BOOKING HANDLER
//////////////////////////////////////////////////////
const handleDeleteBooking = async (req, res) => {
  try {
    const { bookingId, id } = req.body || {};
    const finalBookingId = bookingId || id || req.params?.id;

    if (!finalBookingId) {
      return res.json({ success: false, message: 'Missing bookingId' });
    }

    console.log('🗑️ DELETE BOOKING REQUEST:', finalBookingId, 'method:', req.method);

    try {
      await ddb.send(
        new DeleteCommand({
          TableName: 'Bookings',
          Key: { bookingId: finalBookingId },
        })
      );
    } catch (ddbError) {
      console.error('🔥 DELETE BOOKING DYNAMODB ERROR, fallback in-memory', ddbError);
      const index = inMemoryBookings.findIndex(
        (b) => b.bookingId === finalBookingId || b.id === finalBookingId
      );
      if (index > -1) {
        inMemoryBookings.splice(index, 1);
      }
    }

    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    console.error('🔥 DELETE BOOKING ERROR:', err);
    res.json({ success: false, error: err.message });
  }
};

app.post('/delete-booking', handleDeleteBooking);
app.delete('/delete-booking', handleDeleteBooking);
app.delete('/delete-booking/:id', handleDeleteBooking);

//////////////////////////////////////////////////////
// �🛒 BUY PRODUCT (FIXED)
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

    const orderItem = {
      orderId,
      productName: order.productName,
      farmerName: order.farmerName,
      farmerPhone: order.farmerPhone || null,
      buyerPhone: order.buyerPhone,
      buyerName: order.buyerName || null,
      quantity: order.quantity || "N/A",
      price: order.price || "0",
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const notificationItem = {
      notificationId: Date.now().toString(),
      userId: order.farmerPhone || order.farmerName,
      message: `🛒 New order for ${order.productName}`,
      createdAt: new Date().toISOString(),
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: 'Orders',
          Item: orderItem,
        })
      );

      await ddb.send(
        new PutCommand({
          TableName: 'Notifications',
          Item: notificationItem,
        })
      );
    } catch (dbErr) {
      console.error('🔥 DYNAMODB UNAVAILABLE, using in-memory fallback', dbErr);
      inMemoryOrders.push(orderItem);
      inMemoryNotifications.push(notificationItem);
    }

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
    const phone = req.params.phone;

    let items = [];

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Orders',
          FilterExpression: 'buyerPhone = :p',
          ExpressionAttributeValues: { ':p': phone },
        })
      );
      items = data.Items || [];
    } catch (ddbError) {
      console.error('🔥 ORDERS DYNAMODB ERROR, fallback in-memory', ddbError);
      items = inMemoryOrders.filter((o) => o.buyerPhone === phone);
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("🔥 ORDERS ERROR:", err);
    res.json({ success: false });
  }
});

//////////////////////////////////////////////////////
// �‍🌾 FARMER ORDERS
//////////////////////////////////////////////////////
app.get('/farmer-orders', async (req, res) => {
  try {
    const farmerKey = req.query.farmer;

    if (!farmerKey) {
      return res.json({ success: false, message: 'Missing farmer identifier' });
    }

    let items = [];

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Orders',
          FilterExpression: 'farmerPhone = :f OR farmerName = :f',
          ExpressionAttributeValues: { ':f': farmerKey },
        })
      );
      items = data.Items || [];
    } catch (ddbError) {
      console.error('🔥 FARMER ORDERS DYNAMODB ERROR, fallback in-memory', ddbError);
      items = inMemoryOrders.filter(
        (o) => o.farmerPhone === farmerKey || o.farmerName === farmerKey
      );
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 FARMER ORDERS ERROR:', err);
    res.json({ success: false });
  }
});

//////////////////////////////////////////////////////
// 🛠 UPDATE ORDER STATUS
//////////////////////////////////////////////////////
app.post('/update-order', async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({ success: false, message: 'Missing orderId or status' });
    }

    try {
      const data = await ddb.send(
        new UpdateCommand({
          TableName: 'Orders',
          Key: { orderId },
          UpdateExpression: 'SET #s = :status',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: { ':status': status },
          ReturnValues: 'ALL_NEW',
        })
      );

      const updatedOrder = data.Attributes;

      if (updatedOrder) {
        await ddb.send(
          new PutCommand({
            TableName: 'Notifications',
            Item: {
              notificationId: Date.now().toString(),
              userId: updatedOrder.buyerPhone,
              message: `🛒 Order ${status}: ${updatedOrder.productName}`,
              createdAt: new Date().toISOString(),
            },
          })
        );
      }
    } catch (ddbError) {
      console.error('🔥 UPDATE ORDER DYNAMODB ERROR, fallback in-memory', ddbError);
      const order = inMemoryOrders.find((o) => o.orderId === orderId);
      if (order) {
        order.status = status;
        inMemoryNotifications.push({
          notificationId: Date.now().toString(),
          userId: order.buyerPhone,
          message: `🛒 Order ${status}: ${order.productName}`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    console.error('🔥 UPDATE ORDER ERROR:', err);
    res.json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// �🔔 NOTIFICATIONS
//////////////////////////////////////////////////////
app.get('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    let items = [];

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Notifications',
          FilterExpression: 'userId = :u',
          ExpressionAttributeValues: { ':u': userId },
        })
      );
      items = data.Items || [];
    } catch (ddbError) {
      console.error('🔥 NOTIFICATIONS DYNAMODB ERROR, fallback in-memory', ddbError);
      items = inMemoryNotifications.filter((n) => n.userId === userId);
    }

    res.json({ success: true, data: items });
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