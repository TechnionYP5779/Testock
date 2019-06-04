import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropPendingComponent } from './crop-pending.component';

describe('CropPendingComponent', () => {
  let component: CropPendingComponent;
  let fixture: ComponentFixture<CropPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
