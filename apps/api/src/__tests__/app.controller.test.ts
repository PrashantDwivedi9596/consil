import { describe, it, expect, beforeEach } from 'vitest';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
    appController = new AppController(appService);
  });

  it('should return health status ok', () => {
    const health = appController.getHealth();
    expect(health.status).toBe('ok');
    expect(health.service).toBe('Council API');
    expect(health.stage).toBe(0);
  });
});
