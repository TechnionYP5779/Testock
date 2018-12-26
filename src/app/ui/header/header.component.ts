import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  main_menu_opened: boolean;
  @Output() main_menu_triggered: EventEmitter<boolean>;
  @Input() term: any;

  constructor(public auth: AuthService) {
    this.main_menu_opened = false;
    this.main_menu_triggered = new EventEmitter();
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
  }
}
