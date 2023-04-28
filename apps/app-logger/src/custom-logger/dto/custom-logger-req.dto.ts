export interface CustomLoggerRequestDto {
  name: string;
  timeStamp: string;
  message: string;
  stack?: string;
  type: 'error' | 'warn' | 'debug' | 'info';
}
