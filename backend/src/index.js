import 'dotenv/config';
import express from 'express';

const port = process.env.PORT ;
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the NearBuy API');
});

async function initDb() {
  try {
    const pool = (await import('./config/db.js')).default;
    const client = await pool.connect();
    console.log("✅ Connected to the Neon database successfully.");
    client.release();
  } catch (error) {
    console.error("❌ Error connecting to the Neon database:", error.message);
    console.warn("⚠️  Continuing without database connection for development.");
  }
}

async function startServer() {
  await initDb();
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});