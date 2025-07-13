import { Injectable } from '@angular/core';

export type LogLevel = 'LOG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private logs: string[] = [];

  log(message: string, ...args: any[]) {
    this.addLog('LOG', message, args);
    console.log(message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.addLog('INFO', message, args);
    console.info(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.addLog('WARN', message, args);
    console.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.addLog('ERROR', message, args);
    console.error(message, ...args);
  }

  private addLog(level: LogLevel, message: string, args: any[]) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message} ${args && args.length ? JSON.stringify(args) : ''}`;
    this.logs.push(logEntry);
  }

  getLogs(): string[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  downloadLog(filename: string = 'tabata-log.txt') {
    const blob = new Blob([this.logs.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
} 