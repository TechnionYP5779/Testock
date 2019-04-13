import {Component, Input, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-profile-pic',
  templateUrl: './user-profile-pic.component.html',
  styleUrls: ['./user-profile-pic.component.scss']
})
export class UserProfilePicComponent implements OnInit {

  url: Observable<any>;

  @Input()
  set uid(uid: string) {
    console.log(uid);
    this.url = this.storage.ref(`users/${uid}/profile.jpg`).getDownloadURL();
  }

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
  }

}
