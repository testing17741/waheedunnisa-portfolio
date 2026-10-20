const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const startTime = Date.now();

/**
 * Health check handler
 * Reports server status, uptime, system memory, and operational readiness.
 */
function handleHealthCheck(req, res) {
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
}

/**
 * Publications listing handler
 * Returns published academic papers with optional category filtering.
 */
function handlePublications(req, res) {
  try {
    const dataPath = path.join(__dirname, '../public/data/publications.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    let publications = JSON.parse(raw);

    const { category, type, search } = req.query;

    if (category) {
      publications = publications.filter(p => p.category === category);
    }

    if (type) {
      publications = publications.filter(p => p.type === type);
    }

    if (search) {
      const term = search.toLowerCase();
      publications = publications.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.abstract.toLowerCase().includes(term) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(term)))
      );
    }

    return res.status(200).json({
      success: true,
      data: {
        total: publications.length,
        items: publications
      },
      error: null
    });
  } catch (err) {
    logger.error('Error reading publications dataset', { error: err.message });
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'DATA_READ_ERROR',
        message: 'Could not load publications catalog.'
      }
    });
  }
}

module.exports = {
  handleHealthCheck,
  handlePublications
};
