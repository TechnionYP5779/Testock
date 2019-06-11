import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseQuestionTagComponent } from './choose-question-tag.component';

describe('ChooseQuestionTagComponent', () => {
  let component: ChooseQuestionTagComponent;
  let fixture: ComponentFixture<ChooseQuestionTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseQuestionTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseQuestionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
