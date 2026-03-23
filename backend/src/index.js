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
import { errorHandler, notFound } from './middleware/errorHandler.js';

const port = process.env.PORT;
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_DEV,
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
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api/customers', customerRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
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
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}



startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});