import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WsService } from '../ws/ws.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Output() oStart = new EventEmitter();

  userList = [];
  constructor(public wsService: WsService) { }

  ngOnInit() {
    this.updateUserList();
  }

  updateUserList() {
    this.wsService.socket.on('userList', (data) => {
      this.userList = data;
    });
  }

  startGame() {
    this.wsService.startGame().subscribe(() => {
      this.oStart.emit();
    });
  }

}
