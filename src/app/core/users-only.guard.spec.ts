import { TestBed, async, inject } from '@angular/core/testing';

import { UsersOnlyGuard } from './users-only.guard';

describe('UsersOnlyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersOnlyGuard]
    });
  });

  it('should ...', inject([UsersOnlyGuard], (guard: UsersOnlyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
