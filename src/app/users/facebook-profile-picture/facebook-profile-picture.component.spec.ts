import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookProfilePictureComponent } from './facebook-profile-picture.component';

describe('FacebookProfilePictureComponent', () => {
  let component: FacebookProfilePictureComponent;
  let fixture: ComponentFixture<FacebookProfilePictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookProfilePictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookProfilePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
