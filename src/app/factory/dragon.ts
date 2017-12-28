interface Position {
    x: number;
    y: number;
}

export class Dragon {
    name: string;
    header: Position;
    body: Array<Position>;
    color: string;
    direction: number;
    speed: number;
    score: number;
    radius = 10;

    recordPosition: any;

    constructor(
        name: string = 'unknown',
        header: Position,
        direction: number,
        speed: number,
        body: Array<Position>,
        score: number,
        color: string
    ) {
        this.name = name;
        this.header = header;
        this.direction = direction;
        this.speed = speed;
        this.body = body;
        this.score = score;
        this.color = color;
    }

    render(ctx) {
        // draw body
        ctx.beginPath();
        ctx.moveTo(this.header.x, this.header.y);
        this.body.forEach((position, index) => {
            ctx.lineTo(position.x, position.y);
        });
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = this.radius * 2;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();

        // draw header
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(this.header.x, this.header.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

    }

    move(angle: number, space: number) {
        if (Math.abs(angle - this.direction) < 180) {
            if (angle - this.direction > 0) {
                this.direction += 0.12 * space;
            }
            if (angle - this.direction < 0) {
                this.direction -= 0.12 * space;
            }
        }
        if (Math.abs(angle - this.direction) > 180) {
            if (angle - this.direction > 0) {
                this.direction -= 0.12 * space;
            }
            if (angle - this.direction < 0) {
                this.direction += 0.12 * space;
            }
        }
        if (this.direction > 360) {
            this.direction -= 360;
        }
        if (this.direction < 0) {
            this.direction += 360;
        }

        const moveX = this.speed * space / 1000 * Math.cos(Math.PI * this.direction / 180);
        const moveY = this.speed * space / 1000 * Math.sin(Math.PI * this.direction / 180);
        // const moveY = this.speed * space / 1000 * Math.sin(Math.PI * (this.direction / 180));
        const moveDistance = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2));
        if (moveDistance >= 1) {
            this.body.unshift({x: this.header.x, y: this.header.y});
            this.body.pop();
        }
        this.header.x += moveX;
        this.header.y -= moveY;
        // for(let i in this.body) {
        //   this.body[i].x += x;
        //   this.body[i].y += y;
        // }
    }
}
