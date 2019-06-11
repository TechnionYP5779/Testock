import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../users/auth.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {NotificationsService} from '../../notifications/notifications.service';
import {flatMap} from 'rxjs/operators';
import {of, Observable} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  main_menu_opened: boolean;
  @Output() main_menu_triggered: EventEmitter<boolean>;
  @Input() term: any;
  router: any;
  isAdmin: boolean;
  notificationsCount$: Observable<number>;

  constructor(private rtr: Router, public auth: AuthService, private spinner: NgxSpinnerService, private notifications: NotificationsService) {
    this.main_menu_opened = false;
    this.main_menu_triggered = new EventEmitter();
    this.router = rtr;
    this.auth.isAdmin.subscribe(res => this.isAdmin = res);
    this.notificationsCount$ = this.auth.user$.pipe(
      flatMap(user => {
        if (user) {
          return this.notifications.getUnseenNotificationsCountForUser(user.uid)
        } else {
          return of(0);
        }
      })
    );
  }

  trigger_menu() {
    this.main_menu_opened = !this.main_menu_opened;
    this.main_menu_triggered.emit(this.main_menu_opened);
  }

  ngOnInit() { }

  logout() {
    this.auth.signOut();
  }

  onSearchChange(value: any) {
    this.term = value;
    this.router.navigate(['../courses/' + this.term.toString()]);
  }

  login() {
    this.spinner.show().then(() => this.auth.loginWithCampus()).finally(() => this.spinner.hide());
  }
}
