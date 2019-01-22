import { Component, OnInit } from '@angular/core';
import {DbService} from '../../core/db.service';
import {FacultyId} from '../../core/entities/faculty';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit {

  faculties: FacultyId[];

  constructor(private db: DbService) {
  }

  ngOnInit() {
    this.getFaculties();
  }

  getFaculties(): void {
    this.db.getFaculties().subscribe(faculties => { this.faculties = faculties; });
  }

}
