import { TestBed } from '@angular/core/testing';

import { HealthDataService } from './health-data.service';

describe('HealthDataService', () => {
  let service: HealthDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
