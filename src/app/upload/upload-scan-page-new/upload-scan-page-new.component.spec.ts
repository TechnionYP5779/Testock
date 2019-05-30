import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadScanPageNewComponent } from './upload-scan-page-new.component';

describe('UploadScanPageNewComponent', () => {
  let component: UploadScanPageNewComponent;
  let fixture: ComponentFixture<UploadScanPageNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadScanPageNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadScanPageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
