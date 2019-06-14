import {inject, TestBed} from '@angular/core/testing';

import {AdminOnlyGuard} from './admin-only.guard';

describe('AdminOnlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminOnlyGuard]
    });
  });

  it('should ...', inject([AdminOnlyGuard], (guard: AdminOnlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
