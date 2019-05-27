import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchUploadComponent } from './batch-upload.component';

describe('BatchUploadComponent', () => {
  let component: BatchUploadComponent;
  let fixture: ComponentFixture<BatchUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
