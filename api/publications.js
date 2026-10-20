const fs = require('fs');
const path = require('path');
const logger = require('./logger');

let staticPublications = [];
try {
  staticPublications = require('../public/data/publications.json');
} catch (e) {
  staticPublications = [];
}

/**
 * Publications listing handler (Express & Vercel serverless compatible)
 * Returns published academic papers with optional category filtering.
 */
function handlePublications(req, res) {
  try {
    let publications = Array.isArray(staticPublications) && staticPublications.length > 0
      ? [...staticPublications]
      : JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/publications.json'), 'utf-8'));

    const { category, type, search } = req.query || {};

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

module.exports = handlePublications;
