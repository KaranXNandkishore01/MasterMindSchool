const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const { apiLimiter } = require('./src/middleware/rateLimiter');

const app = express();
app.disable('x-powered-by');

// Strict CORS Configuration to prevent cross-origin credential theft
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, health checks)
    if (!origin) return callback(null, true);
    
    // Check against explicit whitelist or legitimate vercel deployments
    const isWhitelisted = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    if (isWhitelisted) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Access denied for this origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Managed at client/CDN level
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply global rate limiting on all API routes
app.use('/api', apiLimiter);

// Static uploads directory with guaranteed resolution
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check for Render keep-alive & monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Base Route
app.get('/', (req, res) => {
  res.send('MMPS API is running...');
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const managementRoutes = require('./src/routes/managementRoutes');
const publicRoutes = require('./src/routes/publicRoutes');
const erpRoutes = require('./src/routes/erpRoutes');
const staffRoutes = require('./src/routes/staffRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/management', managementRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/staff', staffRoutes);

// Error Handling Middleware placeholder
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

module.exports = app;
