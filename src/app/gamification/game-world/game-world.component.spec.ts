import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWorldComponent } from './game-world.component';

describe('GameWorldComponent', () => {
  let component: GameWorldComponent;
  let fixture: ComponentFixture<GameWorldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameWorldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
