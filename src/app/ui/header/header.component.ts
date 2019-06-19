import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../users/auth.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {NotificationsService} from '../../notifications/notifications.service';
import {map, switchMap} from 'rxjs/operators';
import {of, Observable} from 'rxjs';
import {Course} from '../../entities/course';
import {DbService} from '../../core/db.service';
import {FacultyId} from '../../entities/faculty';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  main_menu_opened: boolean;
  @Output() main_menu_triggered: EventEmitter<boolean>;
  @Input() term: any;
  router: any;
  isAdmin$: Observable<boolean>;
  notificationsCount$: Observable<number>;
  favoriteCourses$: Observable<Course[]>;
  faculties$: Observable<FacultyId[]>;

  constructor(private rtr: Router, public auth: AuthService, private spinner: NgxSpinnerService,
              private notifications: NotificationsService, private db: DbService) {
    this.main_menu_opened = false;
    this.main_menu_triggered = new EventEmitter();
    this.router = rtr;
    this.isAdmin$ = this.auth.isAdmin;
    this.notificationsCount$ = this.auth.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.notifications.getUnseenNotificationsCountForUser(user.uid);
        } else {
          return of(0);
        }
      })
    );
    this.favoriteCourses$ = this.auth.user$.pipe(
      switchMap(userData => this.db.getFavoriteCourses(userData)),
      map(courses => courses.sort((c1, c2) => (c1.name < c2.name) ? -1 : 1))
    );
    this.faculties$ = this.db.getFaculties();
  }

  trigger_menu() {
    this.main_menu_opened = !this.main_menu_opened;
    this.main_menu_triggered.emit(this.main_menu_opened);
  }

  ngOnInit() { }

  async logout() {
    await this.router.navigate(['/']);
    this.auth.signOut();
  }

  onSearchChange($event: any) {
    this.term = $event.target.value;
    this.router.navigate(['../courses/' + this.term.toString()]);
  }

  async login() {
    await this.auth.login();
  }

}
