import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePicComponent } from './user-profile-pic.component';

describe('UserProfilePicComponent', () => {
  let component: UserProfilePicComponent;
  let fixture: ComponentFixture<UserProfilePicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfilePicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfilePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
