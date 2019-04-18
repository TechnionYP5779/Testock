import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs';
import {UserData} from '../../entities/user';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {DbService} from '../../core/db.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user$: Observable<UserData>;
  userId: string;

  constructor(public auth: AuthService, private db: DbService, private route: ActivatedRoute) {
    this.userId = this.route.snapshot.paramMap.get('uid');
    this.user$ = this.userId ?  this.db.getUser(this.userId) : this.auth.user$;
  }

  ngOnInit() {

  }
}
