import {Component, Input, OnInit} from '@angular/core';
import {MsGraphService} from '../../core/msgraph.service';

@Component({
  selector: 'app-ms-user-profile-pic',
  templateUrl: './ms-user-profile-pic.component.html',
  styleUrls: ['./ms-user-profile-pic.component.scss']
})
export class MsUserProfilePicComponent implements OnInit {

  private _uid: string;
  blob$: Promise<Blob>;

  @Input()
  set uid(uid: string) {
    this._uid = uid;
    this.blob$ = this.msgraph.getProfilePictureForUserAsBlob(uid);
  }

  get uid(): string {
    return this._uid;
  }

  constructor(private msgraph: MsGraphService) { }

  ngOnInit() {
  }

}
