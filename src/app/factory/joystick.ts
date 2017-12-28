interface Position {
    x: number;
    y: number;
}

interface RenderArea {
    color: string;
    radius: number;
}

interface Rocker {
    color: string;
    radius: number;
    position: Position;
}

export class Joystick {
    position: Position;
    renderArea: RenderArea;
    rocker: Rocker;
    startX: number;
    startY: number;
    speedCoefficient: number;
    angle: number;
    touching = false;
    constructor(
        position: Position = {x: 50, y: 50},
        renderArea: RenderArea = {
            color: '#e5e5e5',
            radius: 50
        },
        rocker: Rocker = {
            position: {
                x: 0,
                y: 0
            },
            color: '#aaa',
            radius: 16
        }) {
        this.position = position;
        this.renderArea = renderArea;
        this.rocker = rocker;
    }

    moveRocker(x, y) {
        if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= this.renderArea.radius - this.rocker.radius) {
            this.rocker.position = {
                x: x,
                y: y
            };
            this.speedCoefficient = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / (this.renderArea.radius - this.rocker.radius);
        } else {
            this.rocker.position = {
                x: (this.renderArea.radius - this.rocker.radius) * x / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                y: (this.renderArea.radius - this.rocker.radius) * y / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
            };
            this.speedCoefficient = 1;
        }
    }

    handleTouchstart(event) {
        if (event.targetTouches.length !== 1) {
            return ;
        }
        this.touching = true;
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    }

    handleTouchmove(event) {
        if (event.targetTouches.length !== 1) {
            return ;
        }
        event.preventDefault();
        const x  = event.touches[0].clientX - this.startX;
        const y  = event.touches[0].clientY - this.startY;
        this.moveRocker(x, y);
        this.getAngle();
    }

    handleTouchend(event) {
        this.touching = false;
        this.moveRocker(0, 0);
    }

    getAngle() {
        if (this.rocker.position.x >= 0 && this.rocker.position.y < 0) {
            this.angle = Math.floor((Math.atan((-this.rocker.position.y) / (this.rocker.position.x)) * 180 / Math.PI));
        }
        if (this.rocker.position.x < 0 && this.rocker.position.y < 0) {
            this.angle = Math.floor((Math.atan((this.rocker.position.x) / (this.rocker.position.y)) * 180 / Math.PI)) + 90;
        }
        if (this.rocker.position.x < 0 && this.rocker.position.y >= 0) {
            this.angle = Math.floor((Math.atan((this.rocker.position.x) / (this.rocker.position.y)) * 180 / Math.PI)) + 270;
        }
        if (this.rocker.position.x > 0 && this.rocker.position.y > 0) {
            this.angle = Math.floor((Math.atan((this.rocker.position.x) / (this.rocker.position.y)) * 180 / Math.PI)) + 270;
        }
        return this.angle;
    }

    render(ctx) {
        // 区域
        ctx.beginPath();
        ctx.fillStyle = this.renderArea.color;
        ctx.arc( this.position.x, this.position.y, this.renderArea.radius , 0 , 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // 摇杆
        ctx.beginPath();
        ctx.fillStyle = this.rocker.color;
        ctx.arc( this.position.x + this.rocker.position.x, this.position.y + this.rocker.position.y, this.rocker.radius , 0 , 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}
