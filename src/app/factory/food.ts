export interface Position {
    x: number;
    y: number;
}

export class Food {
    radius = 5;
    color = '#CAE1E1';
    energy = 1;
    position: Position;
    alive = true;
    constructor (position: Position, energy: number = 1) {
        this.position = position;
        this.energy = energy;
        this.radius = Math.floor(5 + energy * 0.3);
        if (this.radius >= 9) {
            this.radius = 9;
        }
        this.color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    die() {
        this.alive = false;
    }
}
