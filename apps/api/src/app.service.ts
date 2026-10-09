import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      status: 'ok',
      service: 'Council API',
      timestamp: new Date().toISOString(),
      stage: 0,
      version: '1.0.0',
    };
  }
}
