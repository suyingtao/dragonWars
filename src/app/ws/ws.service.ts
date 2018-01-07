import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class WsService {
    socket: SocketIOClient.Socket;
    host = 'localhost:9091';
    id;
    dragons;

    constructor() {}

    connect() {
        this.socket = io(this.host);
        this.socket.on('connect', () => {
            console.log('连接成功');
        });
        // this.socket.on('dragons', (data) => {
        //     this.dragons = data.dragons;
        // });
    }

    changeDirc(angle: number) {
        this.socket.emit('changeDirc', {angle: angle});
    }

    joinGame() {
        this.socket.emit('joinGame');
        const observable = new Observable(observer => {
            this.socket.on('userID', (data) => {
                this.id = data.id;
                observer.next(data);
            });
        });
        return observable;
    }

}
