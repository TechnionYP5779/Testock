import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingScanModalComponent } from './pending-scan-modal.component';

describe('PendingScanModalComponent', () => {
  let component: PendingScanModalComponent;
  let fixture: ComponentFixture<PendingScanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingScanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingScanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
