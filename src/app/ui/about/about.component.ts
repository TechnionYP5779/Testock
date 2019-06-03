import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  team = [
    {name: 'Ron Marcovich', photo: 'ronmar.jpg', position: ''},
    {name: 'Guy Menhel', photo: 'guymen.jpg', position: ''},
    {name: 'Yuval Ron', photo: 'yuvalron.jpg', position: ''},
    {name: 'Isar A\'mer', photo: 'isaram.jpg', position: ''},
    {name: 'Moshe Sabag', photo: 'moshesab.jpg', position: ''}
  ];

  constructor() { }

  ngOnInit() {
  }

}
