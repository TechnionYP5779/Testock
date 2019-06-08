import {Component, Input, OnInit} from '@angular/core';
import {PendingScanId} from '../../entities/pending-scan';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pending-scan-modal',
  templateUrl: './pending-scan-modal.component.html',
  styleUrls: ['./pending-scan-modal.component.scss']
})
export class PendingScanModalComponent implements OnInit {

  @Input() pendingScan: PendingScanId;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
