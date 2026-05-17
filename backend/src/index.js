import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import customerRoutes from './routes/customerRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import orderItemRoutes from './routes/orderItemRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { ROUTES } from './lib/ROUTES.js';

const port = process.env.PORT;
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_DEV,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files (e.g. product images)
app.use(ROUTES.UPLOADS, express.static(path.resolve(process.cwd(), 'uploads')));

app.use(ROUTES.API.CUSTOMERS, customerRoutes);
app.use(ROUTES.API.VENDORS, vendorRoutes);
app.use(ROUTES.API.PRODUCTS, productRoutes);
app.use(ROUTES.API.ORDERS, orderRoutes);
app.use(ROUTES.API.ORDER_ITEMS, orderItemRoutes);
app.use(ROUTES.API.NOTIFICATIONS, notificationRoutes);
app.use(ROUTES.API.ADMIN, adminRoutes);

app.get(ROUTES.ROOT, (req, res) => {
    res.send('Welcome to the NearBuy API');
});

app.use(notFound);
app.use(errorHandler);

async function initDb() {
  try {
    const pool = (await import('./config/db.js')).default;
    const client = await pool.connect();
    console.log("✅ Connected to the Neon database successfully.");
    client.release();
  } catch (error) {
    console.error(" Error connecting to the Neon database:", error.message);
    console.warn("⚠️ Continuing without database connection for development.");
  }
}

async function startServer() {
  console.log("Initializing database connection...");
  await initDb();

  try {
    const { default: Admin } = await import('./models/Admin.js');
    const bootstrapResult = await Admin.ensureDefaultAdmin();
    if (bootstrapResult.created) {
      console.log(`✅ Default admin account created for ${bootstrapResult.admin.email}`);
    } else if (bootstrapResult.reason && bootstrapResult.reason !== 'admin-exists') {
      console.log(`ℹ️ Admin bootstrap skipped: ${bootstrapResult.reason}`);
    }
  } catch (error) {
    console.warn('⚠️ Admin bootstrap skipped:', error.message);
  }
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}



startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});