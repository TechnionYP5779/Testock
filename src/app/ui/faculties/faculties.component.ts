import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {FacultyId} from '../../core/entities/faculty';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit {

  public faculties$: Observable<FacultyId[]>;

  constructor(private db: DbService) {
  }

  ngOnInit() {
    this.faculties$ = this.db.getFaculties();
  }

}
