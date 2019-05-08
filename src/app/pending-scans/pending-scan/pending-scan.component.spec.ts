import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingScanComponent } from './pending-scan.component';

describe('PendingScanComponent', () => {
  let component: PendingScanComponent;
  let fixture: ComponentFixture<PendingScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
