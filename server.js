/**
 * Production Server: Waheedunnisa Nizamuddin Chaudri Academic Portfolio
 * Built with Express, Helmet, Rate-Limiting, and Structured Logging.
 */

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./api/logger');
const handleContactInquiry = require('./api/contact');
const handleHealthCheck = require('./api/health');
const handlePublications = require('./api/publications');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// 2. CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy.'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
  })
);

// 3. Request Parsing with Strict Size Limits
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

// 4. Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP address, please try again in a few minutes.'
    }
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 inquiries per hour per IP to prevent spam
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many collaboration inquiries submitted. Please wait before submitting another.'
    }
  }
});

app.use('/api/', generalLimiter);

// 5. Request Logging Middleware
app.use((req, res, next) => {
  const reqStart = Date.now();
  const requestId = req.headers['x-request-id'] || `req-${Date.now().toString(36)}`;
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  res.on('finish', () => {
    const duration = Date.now() - reqStart;
    logger.info('HTTP Request', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip
    });
  });

  next();
});

// 6. API Endpoints
app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);
app.get('/api/publications', handlePublications);
app.post('/api/contact', contactLimiter, handleContactInquiry);

// 7. Static Assets with Cache Headers
const staticDir = path.join(__dirname, 'public');
app.use(
  express.static(staticDir, {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
    lastModified: true
  })
);

// Clean routing for static pages
app.get('/publications', (req, res) => {
  res.sendFile(path.join(staticDir, 'publications.html'));
});

app.get('/teaching', (req, res) => {
  res.sendFile(path.join(staticDir, 'teaching.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(staticDir, 'contact.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(staticDir, 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(staticDir, 'terms.html'));
});

app.get('/accessibility', (req, res) => {
  res.sendFile(path.join(staticDir, 'accessibility.html'));
});

// 8. Custom 404 Handler
app.use((req, res) => {
  if (req.accepts('html')) {
    return res.status(404).sendFile(path.join(staticDir, '404.html'));
  }
  if (req.accepts('json')) {
    return res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.originalUrl} not found.`
      }
    });
  }
  return res.status(404).type('txt').send('404 Not Found');
});

// 9. Centralized Error Handler (Never leak stack traces in production)
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const requestId = req.requestId || 'unknown';
  logger.error('Unhandled Application Exception', {
    requestId,
    error: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });

  if (res.headersSent) {
    return next(err);
  }

  if (req.accepts('json')) {
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected server error occurred. Please try again shortly.'
      }
    });
  }

  return res.status(500).sendFile(path.join(staticDir, '500.html'));
});

// 10. Start Server (Only when run directly, not when required by tests)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`Waheedunnisa Chaudri Academic Portfolio running on port ${PORT} [${NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
    server.close(() => {
      logger.info('HTTP server closed. Exiting process.');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
