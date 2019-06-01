import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanEditorComponent } from './scan-editor.component';

describe('ScanEditorComponent', () => {
  let component: ScanEditorComponent;
  let fixture: ComponentFixture<ScanEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
