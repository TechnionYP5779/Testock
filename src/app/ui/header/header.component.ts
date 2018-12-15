import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  main_menu_opened: boolean;
  @Output() menu_triggered: EventEmitter<boolean>;

  constructor() {
    this.main_menu_opened = false;
    this.menu_triggered = new EventEmitter();
  }

  trigger_menu() {
    this.main_menu_opened = !this.main_menu_opened;
    this.menu_triggered.emit(this.main_menu_opened);
  }

  ngOnInit() { }

}
