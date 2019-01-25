import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyControlPanelComponent } from './faculty-control-panel.component';

describe('FacultyControlPanelComponent', () => {
  let component: FacultyControlPanelComponent;
  let fixture: ComponentFixture<FacultyControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacultyControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
