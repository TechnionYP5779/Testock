import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWorldComponent } from './game-world/game-world.component';
import { GamePlanetComponent } from './game-planet/game-planet.component';
import {Planet} from './entities/planet';

const planets: Planet[] = [
  {order: 0, title: 'Level 0', description: 'New Comers', image: 'planet-level-0.png', min_points: 0, max_points: 300},
  {order: 1, title: 'Level 1', description: 'Quick Starters', image: 'planet-level-1.png', min_points: 301, max_points: 600},
  {order: 2, title: 'Level 2', description: 'Early Adopters', image: 'planet-level-2.png', min_points: 601, max_points: 1000},
  {order: 3, title: 'Level 3', description: 'True Contributors', image: 'planet-level-3.png', min_points: 1001, max_points: 1500},
  {order: 4, title: 'Level 4', description: 'Wise Prophets', image: 'planet-level-4.png', min_points: 1501, max_points: 2500},
  {order: 5, title: 'Level 5', description: 'Grand Masters', image: 'planet-level-5.png', min_points: 2501, max_points: 5000}
];

@NgModule({
  declarations: [GameWorldComponent, GamePlanetComponent],
  providers: [
    {provide: 'Planets', useValue: planets}
  ],
  imports: [
    CommonModule
  ]
})
export class GamificationModule {
}
