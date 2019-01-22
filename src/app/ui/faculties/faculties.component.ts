import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {Faculty} from '../../core/entities/faculty';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit {

  faculties: Faculty[];
  route: ActivatedRoute;
  router: Router;

  constructor(private rtr: Router, private r: ActivatedRoute, private db: DbService) {
    this.route = r;
    this.router = rtr;
  }

  ngOnInit() {
    this.db.getFaculties().subscribe(faculties => {
      this.faculties = faculties;
    });
  }

}
