import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.component.html',
  styleUrls: ['./gameover.component.scss']
})
export class GameoverComponent implements OnInit {
  @Input() score = 0;
  @Input() visibility: boolean;
  @Output() visibilityChange = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  close() {
    this.visibilityChange.emit(false);
  }
}
