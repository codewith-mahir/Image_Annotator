const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const { connectDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// In dev, allow requests from CRA dev server and external IPs. In prod, tighten this as needed.
const clientOriginStr = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const allowedOrigins = clientOriginStr.split(',').map((origin) => origin.trim());

console.log('Allowed CORS origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`CORS preflight from: ${origin}`);
      // Always allow same-origin and non-origin requests (e.g., server-to-server, curl)
      if (!origin) return callback(null, true);
      // Allow if origin is in the list
      if (allowedOrigins.includes(origin)) {
        console.log(`✓ Origin matches list: ${origin}`);
        return callback(null, origin);
      }
      // During dev, allow all origins to avoid unnecessary CORS errors
      // In production, remove this fallback and only allow explicit origins
      console.warn(`⚠ CORS: Allowing unlisted origin: ${origin}`);
      return callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
