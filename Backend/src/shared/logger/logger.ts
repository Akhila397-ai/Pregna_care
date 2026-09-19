type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'refreshtoken',
  'accesstoken',
  'resettoken',
  'otphash',
  'secret',
  'authorization',
  'email_pass',
  'aws_secret_access_key',
]);

function sanitizeData(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;
  if (data instanceof Error) {
    return {
      name: data.name,
      message: data.message,
      stack: process.env.NODE_ENV !== 'production' ? data.stack : undefined,
    };
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export class Logger {
  private formatPrefix(level: LogLevel): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]`;
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      console.debug(this.formatPrefix('debug'), message, ...args.map(sanitizeData));
    }
  }

  info(message: string, ...args: any[]): void {
    console.info(this.formatPrefix('info'), message, ...args.map(sanitizeData));
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatPrefix('warn'), message, ...args.map(sanitizeData));
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatPrefix('error'), message, ...args.map(sanitizeData));
  }
}

export const logger = new Logger();
