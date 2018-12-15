import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfjsTestComponent } from './pdfjs-test.component';

describe('PdfjsTestComponent', () => {
  let component: PdfjsTestComponent;
  let fixture: ComponentFixture<PdfjsTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfjsTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfjsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
