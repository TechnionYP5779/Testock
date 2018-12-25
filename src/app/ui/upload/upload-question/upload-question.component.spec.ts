import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadQuestionComponent } from './upload-question.component';

describe('UploadQuestionComponent', () => {
  let component: UploadQuestionComponent;
  let fixture: ComponentFixture<UploadQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
