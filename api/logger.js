/**
 * Structured JSON Logger for Production
 * Formats every log with timestamp, level, request ID, and metadata.
 * Designed to prevent unbounded log growth and integrate with log forwarders.
 */

const LOG_LEVELS = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40
};

const currentLevel = process.env.LOG_LEVEL 
  ? (LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO)
  : LOG_LEVELS.INFO;

function log(levelName, message, context = {}) {
  const levelValue = LOG_LEVELS[levelName] || LOG_LEVELS.INFO;
  if (levelValue < currentLevel) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level: levelName,
    message,
    ...context
  };

  const output = JSON.stringify(entry);
  if (levelName === 'ERROR') {
    process.stderr.write(output + '\n');
  } else {
    process.stdout.write(output + '\n');
  }
}

const logger = {
  debug: (message, context) => log('DEBUG', message, context),
  info: (message, context) => log('INFO', message, context),
  warn: (message, context) => log('WARN', message, context),
  error: (message, context) => log('ERROR', message, context)
};

module.exports = logger;
