import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanDetailsPickerComponent } from './scan-details-picker.component';

describe('ScanDetailsPickerComponent', () => {
  let component: ScanDetailsPickerComponent;
  let fixture: ComponentFixture<ScanDetailsPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanDetailsPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanDetailsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
