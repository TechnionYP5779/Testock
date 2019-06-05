import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScanDetails} from '../../entities/scan-details';
import {Semester} from '../../entities/semester';

@Component({
  selector: 'app-scan-details-picker',
  templateUrl: './scan-details-picker.component.html',
  styleUrls: ['./scan-details-picker.component.scss']
})
export class ScanDetailsPickerComponent implements OnInit {

  details: ScanDetails = new ScanDetails(null, {semester: {num: null, year: null}, num: null});
  semesters: Semester[];

  constructor(public modal: NgbActiveModal) {
    this.semesters = [];
    this.loadSemesters();
  }

  private loadSemesters() {
    const currentMonth = new Date().getMonth() + 1;

    let startYear = new Date().getFullYear();
    if (currentMonth < 7) {
      this.semesters.push({year: startYear - 1, num: 1});
      startYear -= 2;
    } else if (currentMonth < 9) {
      this.semesters.push({year: startYear - 1, num: 2});
      this.semesters.push({year: startYear - 1, num: 1});
      startYear -= 2;
    } else {
      this.semesters.push({year: startYear - 1, num: 3});
      this.semesters.push({year: startYear - 1, num: 2});
      this.semesters.push({year: startYear - 1, num: 1});
      startYear -= 2;
    }

    for (let i = startYear; i >= 2000; --i) {
      this.semesters.push({year: i, num: 3});
      this.semesters.push({year: i, num: 2});
      this.semesters.push({year: i, num: 1});
    }
  }

  ngOnInit() {
  }

  done() {
    this.modal.close(this.details);
  }
}
