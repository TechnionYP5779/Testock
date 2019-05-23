import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingScansListComponent } from './pending-scans-list.component';

describe('PendingScansListComponent', () => {
  let component: PendingScansListComponent;
  let fixture: ComponentFixture<PendingScansListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingScansListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingScansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
