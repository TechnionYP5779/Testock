import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQuestionNewComponent } from './upload-question-new.component';

describe('UploadQuestionNewComponent', () => {
  let component: UploadQuestionNewComponent;
  let fixture: ComponentFixture<UploadQuestionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadQuestionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadQuestionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
