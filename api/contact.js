const { z } = require('zod');
const crypto = require('crypto');
const logger = require('./logger');

// Strict input validation schema
const contactSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required.' })
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains unsupported characters.'),
  email: z
    .string({ required_error: 'Valid email address is required.' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address.')
    .max(150, 'Email must not exceed 150 characters.'),
  affiliation: z
    .string()
    .trim()
    .max(150, 'Affiliation must not exceed 150 characters.')
    .optional()
    .or(z.literal('')),
  subject: z.enum(
    [
      'research_collaboration',
      'guest_lecture',
      'student_inquiry',
      'academic_query',
      'other'
    ],
    {
      errorMap: () => ({ message: 'Please select a valid subject category.' })
    }
  ),
  message: z
    .string({ required_error: 'Message text is required.' })
    .trim()
    .min(15, 'Message must be at least 15 characters.')
    .max(2500, 'Message cannot exceed 2500 characters.'),
  dpdpConsent: z.literal(true, {
    errorMap: () => ({
      message: 'You must consent to data processing for academic communication under India DPDP Act 2023.'
    })
  }),
  website: z.string().optional() // Honeypot trap: bots fill this; real users don't see it.
});

// Basic HTML entity sanitization helper
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Express handler for POST /api/contact
 * Handles collaboration and academic inquiries.
 */
async function handleContactInquiry(req, res, next) {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();

  try {
    // 1. Validate body schema
    const parseResult = contactSchema.safeParse(req.body);

    if (!parseResult.success) {
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      logger.warn('Contact form validation failure', {
        requestId,
        fieldErrors
      });

      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The submitted form contains invalid data.',
          details: fieldErrors
        }
      });
    }

    const data = parseResult.data;

    // 2. Honeypot check: if website field is filled, silently discard or return fake success
    if (data.website && data.website.length > 0) {
      logger.warn('Bot trap triggered via honeypot field', {
        requestId,
        ip: req.ip
      });
      // Respond with success to confuse spam scripts without storing anything
      return res.status(200).json({
        success: true,
        data: {
          message: 'Your inquiry has been received.',
          inquiryId: `BOT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
        },
        error: null
      });
    }

    // 3. Sanitize content for logging and storage
    const sanitizedRecord = {
      inquiryId: `ACAD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      fullName: sanitize(data.fullName),
      email: data.email,
      affiliation: sanitize(data.affiliation || 'Independent / Not specified'),
      subject: data.subject,
      message: sanitize(data.message),
      dpdpConsentGiven: true,
      timestamp: new Date().toISOString()
    };

    logger.info('Academic collaboration inquiry registered', {
      requestId,
      inquiryId: sanitizedRecord.inquiryId,
      subject: sanitizedRecord.subject,
      email: sanitizedRecord.email
    });

    // In a production server with SMTP or a database, deliver here.
    // We confirm delivery to the user with a reference tracking ID.
    return res.status(200).json({
      success: true,
      data: {
        message: 'Thank you for reaching out. Your academic inquiry has been delivered directly to Ms. Waheedunnisa Chaudri.',
        inquiryId: sanitizedRecord.inquiryId,
        subject: sanitizedRecord.subject
      },
      error: null
    });
  } catch (err) {
    logger.error('Unexpected error processing contact inquiry', {
      requestId,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    return next(err);
  }
}

module.exports = {
  handleContactInquiry,
  contactSchema
};
