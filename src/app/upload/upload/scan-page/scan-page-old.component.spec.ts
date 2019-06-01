import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScanPageOldComponent} from './scan-page-old.component';

describe('ScanPageOldComponent', () => {
  let component: ScanPageOldComponent;
  let fixture: ComponentFixture<ScanPageOldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanPageOldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanPageOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
