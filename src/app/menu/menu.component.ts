import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WsService } from '../ws/ws.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() visibility: boolean;
  @Output() visibilityChange = new EventEmitter();
  @Output() startSingleGame = new EventEmitter();
  @Output() startOnlineGame = new EventEmitter();
  inputRoom;

  constructor(private wsService: WsService) { }

  ngOnInit() {
    this.wsService.connect();
  }

  hideMenu() {
    this.visibilityChange.emit(false);
  }

  showMenu() {
    this.visibilityChange.emit(true);
  }

  createRoom() {
    this.wsService.createRoom().subscribe((roomID) => {
    });
  }

  singleGame() {
    this.hideMenu();
    this.startSingleGame.emit();
  }

  joinRoom() {
    this.wsService.joinRoom(this.inputRoom).subscribe(() => {
      this.wsService.roomID = this.inputRoom;
      this.waitGameStart();
    }, (err) => {
      alert(err);
    });
  }

  waitGameStart() {
    this.wsService.waitGamestart().subscribe(() => {
      this.startOnlineGame.emit();
    });
  }
}
