import { TestBed } from '@angular/core/testing';

import { MsgraphService } from './msgraph.service';

describe('MsgraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsgraphService = TestBed.get(MsgraphService);
    expect(service).toBeTruthy();
  });
});
