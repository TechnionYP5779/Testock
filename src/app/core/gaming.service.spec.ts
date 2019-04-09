import { TestBed } from '@angular/core/testing';

import { GamingService } from './gaming.service';

describe('GamingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GamingService = TestBed.get(GamingService);
    expect(service).toBeTruthy();
  });
});
