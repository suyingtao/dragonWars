import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class WsService {
    socket: SocketIOClient.Socket;
    host = '192.168.43.82:9091';
    id;
    dragons;
    roomID;
    roomUserList;
    roomMaster;

    constructor() {}

    connect() {
        this.socket = io(this.host);
        const observable = new Observable(observer => {
            this.socket.on('connect', () => {
                observer.next('连接成功');
            });
        });
        this.socket.on('userID', (data) => {
            this.id = data.id;
        });
        return observable;
    }

    changeDirc(angle: number) {
        this.socket.emit('changeDirc', {angle: angle});
    }

    joinRoom(roomID) {
        this.socket.emit('joinRoom', {roomID: roomID});
        this.socket.on('userList', (data) => {
            this.roomUserList = data.userList;
        });
        const observable = new Observable(observer => {
            this.socket.on('joinState', (data) => {
                if (data.returnCode === 0) {
                    this.roomID = data.roomID;
                    observer.next(data.roomID);
                } else {
                    observer.error(data.returnCodeMessage);
                }
            });
        });
        return observable;
    }

    leaveRoom() {
        this.socket.emit('leaveRoom');
    }

    createRoom() {
        this.socket.emit('createRoom');
        const observable = new Observable(observer => {
            this.socket.on('roomID', (data) => {
                this.roomID = data.roomID;
                this.roomMaster = true;
                observer.next(data.roomID);
            });
        });
        return observable;
    }

    startGame() {
        this.socket.emit('startGame');
        const observable = new Observable(observer => {
            this.socket.on('start', () => {
                observer.next();
            });
        });
        this.socket.on('dragons', (data) => {
            this.dragons = data.dragons;
        });
        this.socket.on('die', (score) => {
            alert('you die! score:' + score);
        });
        this.socket.on('win', (score) => {
            alert('you win! score:' + score);
        });
        return observable;
    }

    waitGamestart() {
        const observable = new Observable(observer => {
            this.socket.on('start', () => {
                observer.next();
            });
            this.socket.on('dragons', (data) => {
                this.dragons = data.dragons;
            });
        });
        return observable;
    }
}
