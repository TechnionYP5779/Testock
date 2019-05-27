import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSolutionModalComponent } from './pending-solution-modal.component';

describe('PendingSolutionModalComponent', () => {
  let component: PendingSolutionModalComponent;
  let fixture: ComponentFixture<PendingSolutionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingSolutionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSolutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
