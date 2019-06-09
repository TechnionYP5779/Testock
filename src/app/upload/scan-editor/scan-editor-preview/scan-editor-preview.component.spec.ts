import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanEditorPreviewComponent } from './scan-editor-preview.component';

describe('ScanEditorPreviewComponent', () => {
  let component: ScanEditorPreviewComponent;
  let fixture: ComponentFixture<ScanEditorPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanEditorPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanEditorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
