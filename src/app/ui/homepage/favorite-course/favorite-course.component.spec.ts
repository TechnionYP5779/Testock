import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCourseComponent } from './favorite-course.component';

describe('FavoriteCourseComponent', () => {
  let component: FavoriteCourseComponent;
  let fixture: ComponentFixture<FavoriteCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
