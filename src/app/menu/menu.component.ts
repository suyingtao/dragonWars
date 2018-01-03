import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() visibility: boolean;
  @Output() visibilityChange = new EventEmitter();
  @Output() startGame = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  hideMenu() {
    this.visibilityChange.emit(false);
  }

  showMenu() {
    this.visibilityChange.emit(true);
  }

  start() {
    this.hideMenu();
    this.startGame.emit();
  }
}
