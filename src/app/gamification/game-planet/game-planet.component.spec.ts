import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlanetComponent } from './game-planet.component';

describe('GamePlanetComponent', () => {
  let component: GamePlanetComponent;
  let fixture: ComponentFixture<GamePlanetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePlanetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePlanetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
