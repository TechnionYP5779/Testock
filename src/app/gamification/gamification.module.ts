import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameWorldComponent } from './game-world/game-world.component';
import { GamePlanetComponent } from './game-planet/game-planet.component';
import {Planet} from './entities/planet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {UsersModule} from '../users/users.module';
import {GamificationService} from './gamification.service';
import {AngularFireFunctions, AngularFireFunctionsModule} from '@angular/fire/functions';
import {AppRoutingModule} from '../app-routing.module';

const planets: Planet[] = [
  {
    order: 0, title: 'Level 0', description: 'New Comers', image: 'planet-level-0.png', min_points: 0, max_points: 300,
    monsters: [
      {order: 1, image: 'planet-0/monster-1.png', owned: false},
      {order: 2, image: 'planet-0/monster-2.png', owned: false},
      {order: 3, image: 'planet-0/monster-3.png', owned: false},
      {order: 4, image: 'planet-0/monster-4.png', owned: false},
      {order: 5, image: 'planet-0/monster-5.png', owned: false}
    ]
  },
  {
    order: 1, title: 'Level 1', description: 'Quick Starters', image: 'planet-level-1.png', min_points: 301, max_points: 600,
    monsters: [
      {order: 1, image: 'planet-1/monster-1.png', owned: false},
      {order: 2, image: 'planet-1/monster-2.png', owned: false},
      {order: 3, image: 'planet-1/monster-3.png', owned: false},
      {order: 4, image: 'planet-1/monster-4.png', owned: false},
      {order: 5, image: 'planet-1/monster-5.png', owned: false}
    ]
  },
  {
    order: 2, title: 'Level 2', description: 'Early Adopters', image: 'planet-level-2.png', min_points: 601, max_points: 1000,
    monsters: [
      {order: 1, image: 'planet-2/monster-1.png', owned: false},
      {order: 2, image: 'planet-2/monster-2.png', owned: false},
      {order: 3, image: 'planet-2/monster-3.png', owned: false},
      {order: 4, image: 'planet-2/monster-4.png', owned: false},
      {order: 5, image: 'planet-2/monster-5.png', owned: false}
    ]
  },
  {
    order: 3, title: 'Level 3', description: 'True Contributors', image: 'planet-level-3.png', min_points: 1001, max_points: 1500,
    monsters: [
      {order: 1, image: 'planet-3/monster-1.png', owned: false},
      {order: 2, image: 'planet-3/monster-2.png', owned: false},
      {order: 3, image: 'planet-3/monster-3.png', owned: false},
      {order: 4, image: 'planet-3/monster-4.png', owned: false},
      {order: 5, image: 'planet-3/monster-5.png', owned: false}
    ]
  },
  {
    order: 4, title: 'Level 4', description: 'Wise Prophets', image: 'planet-level-4.png', min_points: 1501, max_points: 2500,
    monsters: [
      {order: 1, image: 'planet-4/monster-1.png', owned: false},
      {order: 2, image: 'planet-4/monster-2.png', owned: false},
      {order: 3, image: 'planet-4/monster-3.png', owned: false},
      {order: 4, image: 'planet-4/monster-4.png', owned: false},
      {order: 5, image: 'planet-4/monster-5.png', owned: false}
    ]
  },
  {
    order: 5, title: 'Level 5', description: 'Grand Masters', image: 'planet-level-5.png', min_points: 2501, max_points: 5000,
    monsters: [
      {order: 1, image: 'planet-5/monster-1.png', owned: false},
      {order: 2, image: 'planet-5/monster-2.png', owned: false},
      {order: 3, image: 'planet-5/monster-3.png', owned: false},
      {order: 4, image: 'planet-5/monster-4.png', owned: false}
    ]
  }
];

@NgModule({
  declarations: [GameWorldComponent, GamePlanetComponent],
  providers: [
    {provide: 'Planets', useValue: planets},
    GamificationService
  ],
  imports: [
    CommonModule,
    UsersModule,
    FontAwesomeModule,
    AngularFireFunctionsModule,
    AppRoutingModule
  ]
})
export class GamificationModule {
}
