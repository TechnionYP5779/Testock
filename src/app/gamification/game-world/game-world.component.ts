import {Component, Injector, OnInit} from '@angular/core';
import {Planet} from '../entities/planet';

@Component({
  selector: 'app-game-world',
  templateUrl: './game-world.component.html',
  styleUrls: ['./game-world.component.scss']
})
export class GameWorldComponent implements OnInit {
  planets: Planet[];
  constructor(private injector: Injector) {
    this.planets = this.injector.get<Planet[]>('Planets' as any);
  }
  ngOnInit() {
  }

}
