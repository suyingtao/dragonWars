export class Dragon {
    header: Array<number>;
    direction: number;
    speed: number;
    body: Array<any>;

    constructor(header, direction, speed, body) {
        this.header = header;
        this.direction = direction;
        this.speed = speed;
        this.body = body;
    }

}
