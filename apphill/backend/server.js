require('dotenv').config({ path: __dirname + '/.env' });

console.log("🔥 SERVER STARTING...");

const express = require('express');
const cors = require('cors');
const http = require('http');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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

//////////////////////////////////////////////////////
// ⚙️ CONFIGURATION & ENVIRONMENT
//////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const ML_SERVICE_HOST = process.env.ML_SERVICE_HOST || '127.0.0.1';
const ML_SERVICE_PORT = parseInt(process.env.ML_SERVICE_PORT || '5001', 10);
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'smarthill_admin_secret_2026';

//////////////////////////////////////////////////////
// 🧠 IN-MEMORY FALLBACK STORES
// Used when DynamoDB is inaccessible or in local dev
//////////////////////////////////////////////////////
const inMemoryUsers = [];
const inMemoryTractors = [];
const inMemoryProducts = [];
const inMemoryOrders = [];
const inMemoryBookings = [];
const inMemoryNotifications = [];

//////////////////////////////////////////////////////
// 🛡️ HELPERS: IDS & SANITIZATION
//////////////////////////////////////////////////////
const generateId = (prefix) => `${prefix}_${crypto.randomUUID()}`;

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

//////////////////////////////////////////////////////
// 🌐 MIDDLEWARE
//////////////////////////////////////////////////////
app.use(cors());
app.use(express.json());

// Global request logger
app.use((req, res, next) => {
  console.log(`➡️ [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//////////////////////////////////////////////////////
// 🔥 HEALTH TEST ROUTE
//////////////////////////////////////////////////////
app.get('/test', (req, res) => {
  res.send('SERVER OK');
});

//////////////////////////////////////////////////////
// ☁️ AWS DYNAMODB CLIENT
//////////////////////////////////////////////////////
const client = new DynamoDBClient({
  region: AWS_REGION,
});

const ddb = DynamoDBDocumentClient.from(client);

//////////////////////////////////////////////////////
// 🔐 AUTH: SIGNUP
//////////////////////////////////////////////////////
app.post('/signup', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body || {};
    const cleanPhone = phone?.toString().trim();

    if (!cleanPhone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, password, and role are required',
      });
    }

    console.log(`📝 SIGNUP REQUEST for phone: ${cleanPhone}, role: ${role}`);

    // Check if user already exists
    let existing;
    try {
      existing = await ddb.send(
        new GetCommand({
          TableName: 'Users',
          Key: { userId: cleanPhone },
        })
      );
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for signup check, checking in-memory fallback');
      existing = { Item: inMemoryUsers.find((u) => u.userId === cleanPhone) };
    }

    if (existing?.Item) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Securely hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const userItem = {
      userId: cleanPhone,
      name: (name || cleanPhone).toString().trim(),
      phone: cleanPhone,
      password: hashedPassword,
      role: role.toString().trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: 'Users',
          Item: userItem,
        })
      );
      console.log(`✅ User ${cleanPhone} saved to DynamoDB`);
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB PutCommand failed, saving to in-memory fallback');
      inMemoryUsers.push(userItem);
    }

    res.status(201).json({
      success: true,
      message: 'User created',
      user: sanitizeUser(userItem),
    });
  } catch (err) {
    console.error('🔥 SIGNUP ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 👥 GET ALL USERS (Sanitized - No Password Leak)
//////////////////////////////////////////////////////
app.get('/users', async (req, res) => {
  try {
    let rawUsers = [];
    let source = 'dynamodb';

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Users',
        })
      );
      rawUsers = data.Items || [];
    } catch (ddbError) {
      source = 'in-memory';
      rawUsers = inMemoryUsers;
    }

    // Sanitize passwords out of response
    const users = rawUsers.map(sanitizeUser);

    res.json({
      success: true,
      count: users.length,
      source,
      users,
    });
  } catch (err) {
    console.error('🔥 GET USERS ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🔐 AUTH: LOGIN
//////////////////////////////////////////////////////
app.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body || {};
    const cleanPhone = phone?.toString().trim();

    if (!cleanPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required',
      });
    }

    let result;
    try {
      result = await ddb.send(
        new GetCommand({
          TableName: 'Users',
          Key: { userId: cleanPhone },
        })
      );
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for login, checking in-memory fallback');
      result = { Item: inMemoryUsers.find((u) => u.userId === cleanPhone) };
    }

    if (!result?.Item) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify bcrypt hash (or fallback plaintext for legacy development data)
    const storedPassword = result.Item.password;
    const isPasswordValid =
      storedPassword === password.toString() ||
      (await bcrypt.compare(password.toString(), storedPassword));

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Wrong password' });
    }

    console.log(`✅ Login successful for ${cleanPhone} (${result.Item.role})`);
    res.json({
      success: true,
      user: sanitizeUser(result.Item),
    });
  } catch (err) {
    console.error('🔥 LOGIN ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🗑️ SECURE DELETE ALL USERS (Protected by ADMIN_SECRET)
//////////////////////////////////////////////////////
app.delete('/delete-all-users', async (req, res) => {
  try {
    const providedSecret = req.headers['x-admin-secret'];

    if (!providedSecret || providedSecret !== ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Valid x-admin-secret header is required',
      });
    }

    console.log('🗑️ AUTHORIZED DELETE ALL USERS REQUEST');

    inMemoryUsers.length = 0;

    let deletedCount = 0;
    try {
      const scanResult = await ddb.send(
        new ScanCommand({
          TableName: 'Users',
        })
      );

      if (scanResult.Items && scanResult.Items.length > 0) {
        for (const user of scanResult.Items) {
          try {
            await ddb.send(
              new DeleteCommand({
                TableName: 'Users',
                Key: { userId: user.userId },
              })
            );
            deletedCount++;
          } catch (deleteError) {
            console.error(`❌ Error deleting user ${user.userId}:`, deleteError);
          }
        }
      }

      res.json({
        success: true,
        message: `All users deleted (${deletedCount} removed)`,
        deletedCount,
      });
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable, in-memory users cleared');
      res.json({
        success: true,
        message: 'In-memory users cleared',
        deletedCount: 0,
      });
    }
  } catch (err) {
    console.error('🔥 DELETE ALL USERS ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🚜 TRACTORS: REGISTER TRACTOR
//////////////////////////////////////////////////////
app.post('/register-tractor', async (req, res) => {
  try {
    const tractor = req.body || {};

    if (!tractor.model || !tractor.number || !tractor.ownerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Model, registration number, and owner phone are required',
      });
    }

    const tractorId = generateId('trac');

    const tractorItem = {
      tractorId,
      ownerPhone: tractor.ownerPhone.toString().trim(),
      ownerName: (tractor.ownerName || 'Unknown').toString().trim(),
      model: tractor.model.toString().trim(),
      number: tractor.number.toString().trim(),
      location: tractor.location || '',
      hourlyRate: tractor.hourlyRate || '0',
      dailyRate: tractor.dailyRate || '0',
      status: tractor.status || 'Available',
      createdAt: new Date().toISOString(),
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: 'Tractors',
          Item: tractorItem,
        })
      );
      console.log(`✅ Tractor ${tractorId} saved to DynamoDB`);
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for tractor registration, saving in-memory');
      inMemoryTractors.push(tractorItem);
    }

    res.status(201).json({
      success: true,
      message: 'Tractor registered',
      tractorId,
    });
  } catch (err) {
    console.error('🔥 REGISTER TRACTOR ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🚜 TRACTORS: GET AVAILABLE TRACTORS
//////////////////////////////////////////////////////
app.get('/tractors', async (req, res) => {
  try {
    let items = [];

    try {
      const data = await ddb.send(
        new ScanCommand({
          TableName: 'Tractors',
          FilterExpression: '#status = :s',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: { ':s': 'Available' },
        })
      );
      items = data.Items || [];
    } catch (err) {
      console.warn('⚠️ DynamoDB unavailable for /tractors, using in-memory');
      items = inMemoryTractors.filter((t) => t.status === 'Available');
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 GET AVAILABLE TRACTORS ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🛍️ PRODUCTS: ADD PRODUCT
//////////////////////////////////////////////////////
app.post('/products', async (req, res) => {
  try {
    const product = req.body || {};

    if (
      !product.productName ||
      !product.category ||
      !product.price ||
      !product.quantity ||
      !product.farmerPhone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Product name, category, price, quantity, and farmerPhone are required',
      });
    }

    const productId = generateId('prod');

    const productItem = {
      productId,
      farmerName: (product.farmerName || 'Unknown').toString().trim(),
      farmerPhone: product.farmerPhone.toString().trim(),
      productName: product.productName.toString().trim(),
      category: product.category.toString().trim(),
      quantity: product.quantity.toString(),
      price: product.price.toString(),
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
      console.log(`✅ Product ${productId} saved to DynamoDB`);
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for product creation, saving in-memory');
      inMemoryProducts.push(productItem);
    }

    res.status(201).json({
      success: true,
      message: 'Product saved',
      productId,
    });
  } catch (err) {
    console.error('🔥 ADD PRODUCT ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🛍️ PRODUCTS: GET PRODUCTS
//////////////////////////////////////////////////////
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
      console.warn('⚠️ DynamoDB unavailable for products list, using in-memory');
      items = inMemoryProducts;
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 GET PRODUCTS ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🚜 BOOKINGS: BOOK TRACTOR
//////////////////////////////////////////////////////
app.post('/book-tractor', async (req, res) => {
  try {
    const booking = req.body || {};

    if (!booking.tractorModel || !booking.ownerName || !booking.ownerPhone || !booking.farmerPhone) {
      return res.status(400).json({
        success: false,
        message: 'tractorModel, ownerName, ownerPhone, and farmerPhone are required',
      });
    }

    const bookingId = generateId('book');
    const notificationId = generateId('notif');

    const bookingItem = {
      bookingId,
      tractorModel: booking.tractorModel,
      ownerName: booking.ownerName,
      ownerPhone: booking.ownerPhone.toString().trim(),
      farmerPhone: booking.farmerPhone.toString().trim(),
      farmerName: booking.farmerName?.trim() || 'Unknown Farmer',
      fromDate: booking.fromDate || new Date().toISOString(),
      toDate: booking.toDate || new Date().toISOString(),
      hours: booking.hours || '1',
      total: booking.total || '0',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const notificationItem = {
      notificationId,
      userId: booking.ownerPhone.toString().trim(),
      message: `🚜 New booking request for ${booking.tractorModel} from ${bookingItem.farmerName}`,
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
      console.log(`✅ Booking ${bookingId} and notification saved to DynamoDB`);
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for booking, saving in-memory');
      inMemoryBookings.push(bookingItem);
      inMemoryNotifications.push(notificationItem);
    }

    res.status(201).json({ success: true, bookingId });
  } catch (err) {
    console.error('🔥 BOOK TRACTOR ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🚜 BOOKINGS: GET FARMER BOOKINGS
//////////////////////////////////////////////////////
app.get('/bookings/:phone', async (req, res) => {
  try {
    const phone = req.params.phone?.toString().trim();
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
      console.warn('⚠️ DynamoDB unavailable for /bookings, using in-memory');
      items = inMemoryBookings.filter((b) => b.farmerPhone === phone);
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 BOOKINGS ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🚜 BOOKINGS: GET TRACTOR OWNER REQUESTS
//////////////////////////////////////////////////////
app.get('/owner-requests/:owner', async (req, res) => {
  try {
    const owner = req.params.owner?.toString().trim();
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
      console.warn('⚠️ DynamoDB unavailable for /owner-requests, using in-memory');
      items = inMemoryBookings.filter(
        (b) => b.ownerPhone === owner || b.ownerName === owner
      );
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 OWNER REQUESTS ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🚜 BOOKINGS: UPDATE STATUS (Accept / Reject)
//////////////////////////////////////////////////////
app.post('/update-booking', async (req, res) => {
  try {
    const { bookingId, status } = req.body || {};

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: 'Missing bookingId or status' });
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
              notificationId: generateId('notif'),
              userId: updatedBooking.farmerPhone,
              message: `📣 Booking ${status}: ${updatedBooking.tractorModel}`,
              createdAt: new Date().toISOString(),
            },
          })
        );
      }
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for update-booking, updating in-memory');
      const booking = inMemoryBookings.find((b) => b.bookingId === bookingId);
      if (booking) {
        booking.status = status;
        updatedBooking = booking;
      }

      if (updatedBooking) {
        inMemoryNotifications.push({
          notificationId: generateId('notif'),
          userId: updatedBooking.farmerPhone,
          message: `📣 Booking ${status}: ${updatedBooking.tractorModel}`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, message: 'Booking status updated' });
  } catch (err) {
    console.error('🔥 UPDATE BOOKING ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🗑️ BOOKINGS: DELETE BOOKING HANDLER
//////////////////////////////////////////////////////
const handleDeleteBooking = async (req, res) => {
  try {
    const { bookingId, id } = req.body || {};
    const finalBookingId = bookingId || id || req.params?.id;

    if (!finalBookingId) {
      return res.status(400).json({ success: false, message: 'Missing bookingId' });
    }

    console.log(`🗑️ DELETE BOOKING REQUEST: ${finalBookingId}`);

    try {
      await ddb.send(
        new DeleteCommand({
          TableName: 'Bookings',
          Key: { bookingId: finalBookingId },
        })
      );
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for delete-booking, removing from in-memory');
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
    res.status(500).json({ success: false, error: err.message });
  }
};

app.post('/delete-booking', handleDeleteBooking);
app.delete('/delete-booking', handleDeleteBooking);
app.delete('/delete-booking/:id', handleDeleteBooking);

//////////////////////////////////////////////////////
// 🛒 ORDERS: BUY PRODUCT
//////////////////////////////////////////////////////
app.post('/buy-product', async (req, res) => {
  try {
    const order = req.body || {};

    if (!order.productName || !order.farmerName || !order.buyerPhone) {
      return res.status(400).json({
        success: false,
        message: 'productName, farmerName, and buyerPhone are required',
      });
    }

    const orderId = generateId('ord');
    const notificationId = generateId('notif');

    const orderItem = {
      orderId,
      productName: order.productName,
      farmerName: order.farmerName,
      farmerPhone: order.farmerPhone?.toString().trim() || null,
      buyerPhone: order.buyerPhone.toString().trim(),
      buyerName: order.buyerName || null,
      quantity: order.quantity || 'N/A',
      price: order.price || '0',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const targetRecipient = order.farmerPhone || order.farmerName;
    const notificationItem = {
      notificationId,
      userId: targetRecipient.toString().trim(),
      message: `🛒 New order for ${order.productName} by ${order.buyerName || order.buyerPhone}`,
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
      console.log(`✅ Order ${orderId} and notification saved to DynamoDB`);
    } catch (dbErr) {
      console.warn('⚠️ DynamoDB unavailable for buy-product, saving in-memory');
      inMemoryOrders.push(orderItem);
      inMemoryNotifications.push(notificationItem);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed',
      orderId,
    });
  } catch (err) {
    console.error('🔥 BUY PRODUCT ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 📦 ORDERS: GET CUSTOMER ORDERS
//////////////////////////////////////////////////////
app.get('/orders/:phone', async (req, res) => {
  try {
    const phone = req.params.phone?.toString().trim();
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
      console.warn('⚠️ DynamoDB unavailable for /orders, using in-memory');
      items = inMemoryOrders.filter((o) => o.buyerPhone === phone);
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 ORDERS ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🌾 ORDERS: GET FARMER ORDERS
//////////////////////////////////////////////////////
app.get('/farmer-orders', async (req, res) => {
  try {
    const farmerKey = req.query.farmer?.toString().trim();

    if (!farmerKey) {
      return res.status(400).json({ success: false, message: 'Missing farmer identifier' });
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
      console.warn('⚠️ DynamoDB unavailable for /farmer-orders, using in-memory');
      items = inMemoryOrders.filter(
        (o) => o.farmerPhone === farmerKey || o.farmerName === farmerKey
      );
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 FARMER ORDERS ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 📦 ORDERS: UPDATE ORDER STATUS
//////////////////////////////////////////////////////
app.post('/update-order', async (req, res) => {
  try {
    const { orderId, status } = req.body || {};

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: 'Missing orderId or status' });
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
              notificationId: generateId('notif'),
              userId: updatedOrder.buyerPhone,
              message: `🛒 Order ${status}: ${updatedOrder.productName}`,
              createdAt: new Date().toISOString(),
            },
          })
        );
      }
    } catch (ddbError) {
      console.warn('⚠️ DynamoDB unavailable for update-order, updating in-memory');
      const order = inMemoryOrders.find((o) => o.orderId === orderId);
      if (order) {
        order.status = status;
        inMemoryNotifications.push({
          notificationId: generateId('notif'),
          userId: order.buyerPhone,
          message: `🛒 Order ${status}: ${order.productName}`,
          createdAt: new Date().toISOString(),
        });
      }
    }

    res.json({ success: true, message: 'Order status updated' });
  } catch (err) {
    console.error('🔥 UPDATE ORDER ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////////////////////////////////
// 🔔 NOTIFICATIONS: GET USER NOTIFICATIONS
//////////////////////////////////////////////////////
app.get('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId?.toString().trim();
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
      console.warn('⚠️ DynamoDB unavailable for /notifications, using in-memory');
      items = inMemoryNotifications.filter((n) => n.userId === userId);
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error('🔥 NOTIFICATION ERROR:', err);
    res.status(500).json({ success: false, data: [] });
  }
});

//////////////////////////////////////////////////////
// 🌱 CROP PREDICTION: Proxy to Python ML Service
//////////////////////////////////////////////////////
app.post('/predict-crop', (req, res) => {
  const body = req.body || {};
  console.log('🌾 CROP PREDICTION REQUEST:', body);

  const required = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
  const missing = required.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ''
  );

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required prediction fields: ${missing.join(', ')}`,
    });
  }

  const payload = JSON.stringify({
    N: parseFloat(body.N),
    P: parseFloat(body.P),
    K: parseFloat(body.K),
    temperature: parseFloat(body.temperature),
    humidity: parseFloat(body.humidity),
    ph: parseFloat(body.ph),
    rainfall: parseFloat(body.rainfall),
  });

  const options = {
    hostname: ML_SERVICE_HOST,
    port: ML_SERVICE_PORT,
    path: '/predict',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const mlReq = http.request(options, (mlRes) => {
    let data = '';
    mlRes.on('data', (chunk) => {
      data += chunk;
    });
    mlRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('✅ ML Service response received');
        res.json(parsed);
      } catch (e) {
        res.status(502).json({ success: false, error: 'Invalid response from ML service' });
      }
    });
  });

  mlReq.on('error', (err) => {
    console.error('🔥 ML SERVICE ERROR:', err.message);
    res.status(503).json({
      success: false,
      error: 'ML service is currently unavailable. Ensure Python service is running on port 5001.',
    });
  });

  mlReq.write(payload);
  mlReq.end();
});

//////////////////////////////////////////////////////
// 🚀 START SERVER
//////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`🚀 SmartHill Backend Server running on port ${PORT}`);
});
