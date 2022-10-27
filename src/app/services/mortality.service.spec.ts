import { TestBed } from '@angular/core/testing';

import { MortalityService } from './mortality.service';

describe('MortalityService', () => {
  let service: MortalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MortalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
