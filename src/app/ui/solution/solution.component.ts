import {Component, Input, OnInit} from '@angular/core';
import {SolutionId} from '../../core/entities/solution';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss']
})
export class SolutionComponent implements OnInit {

  @Input() solution: SolutionId;
  @Input() total_grade: number;

  constructor() { }

  ngOnInit() {
  }

}
