import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-facebook-profile-picture',
  templateUrl: './facebook-profile-picture.component.html',
  styleUrls: ['./facebook-profile-picture.component.scss']
})
export class FacebookProfilePictureComponent implements OnInit {

  @Input() width = 50;
  @Input() height = 50;
  url: string;

  constructor() {}

  ngOnInit() {
  }

  @Input() set fbUid(uid: string) {
      this.url = `https://graph.facebook.com/${uid}/picture?width=${this.width}&height=${this.height}`;
  }

}
