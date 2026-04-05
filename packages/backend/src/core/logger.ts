import pino from 'pino';
import { getEnv } from './config.js';

let _logger: pino.Logger | null = null;

export function getLogger(name?: string): pino.Logger {
  if (!_logger) {
    _logger = pino({
      level: getEnv().LOG_LEVEL,
      formatters: {
        level: (label) => ({ level: label }),
      },
    });
  }
  return name ? _logger.child({ name }) : _logger;
}
