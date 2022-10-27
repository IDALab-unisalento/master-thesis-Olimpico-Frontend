import { TestBed } from '@angular/core/testing';

import { HeartHealthService } from './heart-health.service';

describe('HeartHealthService', () => {
  let service: HeartHealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeartHealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
