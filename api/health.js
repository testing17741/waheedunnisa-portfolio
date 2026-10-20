const startTime = Date.now();

/**
 * Health check handler (Express & Vercel serverless compatible)
 */
module.exports = function handleHealthCheck(req, res) {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage();

  return res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      service: 'waheedunnisa-academic-portfolio-api',
      uptimeSeconds,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      memory: {
        heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
        rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100
      }
    },
    error: null
  });
};
