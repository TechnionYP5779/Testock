import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsUserProfilePicComponent } from './ms-user-profile-pic.component';

describe('MsUserProfilePicComponent', () => {
  let component: MsUserProfilePicComponent;
  let fixture: ComponentFixture<MsUserProfilePicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsUserProfilePicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsUserProfilePicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
