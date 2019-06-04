import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSolutionComponent } from './question-solution.component';

describe('QuestionSolutionComponent', () => {
  let component: QuestionSolutionComponent;
  let fixture: ComponentFixture<QuestionSolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionSolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
