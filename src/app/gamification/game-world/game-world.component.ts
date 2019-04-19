import {Component, Injector, OnInit} from '@angular/core';
import {Planet} from '../entities/planet';

@Component({
  selector: 'app-game-world',
  templateUrl: './game-world.component.html',
  styleUrls: ['./game-world.component.scss']
})
export class GameWorldComponent implements OnInit {
  planets: Planet[];
  selected_planet: number;
  constructor(private injector: Injector) {
    this.planets = this.injector.get<Planet[]>('Planets' as any);
    this.selected_planet = -1;
  }
  ngOnInit() {
  }

  private openPlanetPopup(id: number) {
    this.selected_planet = id;
  }

  private closePlanetPopup(id: number) {
    this.selected_planet = -1;
  }

}
