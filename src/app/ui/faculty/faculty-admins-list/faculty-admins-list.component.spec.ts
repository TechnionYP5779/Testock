import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyAdminsListComponent } from './faculty-admins-list.component';

describe('FacultyAdminsListComponent', () => {
  let component: FacultyAdminsListComponent;
  let fixture: ComponentFixture<FacultyAdminsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyAdminsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyAdminsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
