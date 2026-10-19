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
  'aws_access_key_id',
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
  private formatPrefix(level: LogLevel, contextId?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = contextId ? ` [${contextId}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${ctx}`;
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

  withContext(contextId: string) {
    return {
      debug: (msg: string, ...args: any[]) =>
        console.debug(this.formatPrefix('debug', contextId), msg, ...args.map(sanitizeData)),
      info: (msg: string, ...args: any[]) =>
        console.info(this.formatPrefix('info', contextId), msg, ...args.map(sanitizeData)),
      warn: (msg: string, ...args: any[]) =>
        console.warn(this.formatPrefix('warn', contextId), msg, ...args.map(sanitizeData)),
      error: (msg: string, ...args: any[]) =>
        console.error(this.formatPrefix('error', contextId), msg, ...args.map(sanitizeData)),
    };
  }
}

export const logger = new Logger();
