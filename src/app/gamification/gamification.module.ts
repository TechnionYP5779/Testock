import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWorldComponent } from './game-world/game-world.component';
import { GamePlanetComponent } from './game-planet/game-planet.component';

@NgModule({
  declarations: [GameWorldComponent, GamePlanetComponent],
  imports: [
    CommonModule
  ]
})
export class GamificationModule { }
