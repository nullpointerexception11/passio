/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown> | unknown;
}

class LoggerService {
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private logBuffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 1000;

  constructor() {
    this.info('Logger', 'Structured logger service initialized successfully.');
  }

  private createEntry(level: LogLevel, context: string, message: string, data?: Record<string, unknown> | unknown): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      data,
    };

    // Buffer management for offline session diagnostic dumps
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift(); // Evict oldest log entry
    }

    return entry;
  }

  private printToConsole(entry: LogEntry) {
    if (!this.isDevelopment) return;

    const time = new Date(entry.timestamp).toLocaleTimeString();
    const stylePrefix = `[PASSIO] [${time}] [${entry.level}] [${entry.context}]:`;
    
    let style = 'color: #8C7A5B; font-weight: bold;'; // Warm bronze accent by default
    if (entry.level === LogLevel.DEBUG) style = 'color: #7a7a7a; font-style: italic;';
    if (entry.level === LogLevel.WARN) style = 'color: #D4AF37; font-weight: bold;';
    if (entry.level === LogLevel.ERROR) style = 'color: #e5484d; font-weight: bold;';

    if (entry.data) {
      console.log(`%c${stylePrefix}`, style, entry.message, entry.data);
    } else {
      console.log(`%c${stylePrefix}`, style, entry.message);
    }
  }

  public debug(context: string, message: string, data?: Record<string, unknown> | unknown) {
    const entry = this.createEntry(LogLevel.DEBUG, context, message, data);
    this.printToConsole(entry);
  }

  public info(context: string, message: string, data?: Record<string, unknown> | unknown) {
    const entry = this.createEntry(LogLevel.INFO, context, message, data);
    this.printToConsole(entry);
  }

  public warn(context: string, message: string, data?: Record<string, unknown> | unknown) {
    const entry = this.createEntry(LogLevel.WARN, context, message, data);
    this.printToConsole(entry);
  }

  public error(context: string, message: string, error?: Error | unknown, data?: Record<string, unknown> | unknown) {
    const errData = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error;
    const combinedData = data ? { ...(data as Record<string, unknown>), error: errData } : { error: errData };
    
    const entry = this.createEntry(LogLevel.ERROR, context, message, combinedData);
    this.printToConsole(entry);
  }

  public getLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  public clearLogs() {
    this.logBuffer = [];
  }

  /**
   * Generates a diagnostic payload, perfect for local storage saving or local diagnostic exportation
   */
  public exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

export const Logger = new LoggerService();
export default Logger;
