import {TestBed} from '@angular/core/testing';

import {OCRService} from './ocr.service';

describe('OCRService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OCRService = TestBed.get(OCRService);
    expect(service).toBeTruthy();
  });
});
