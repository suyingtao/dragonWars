interface Position {
    x: number;
    y: number;
}

interface RenderArea {
    color: string;
    radius: number;
    speedUpColor: string;
}

export class SpeedUp {
    position: Position;
    renderArea: RenderArea;
    touching = false;

    constructor(
        position: Position = {x: 50, y: 50},
        renderArea: RenderArea = {
            color: '#e5e5e5',
            speedUpColor: '#ccc',
            radius: 50
        }) {
        this.position = position;
        this.renderArea = renderArea;
    }

    init() {
        this.touching = false;
    }
    handleTouchstart(event) {
        if (event.targetTouches.length !== 1) {
            return ;
        }
        this.touching = true;
    }

    handleTouchend(event) {
        this.touching = false;
    }

    render(ctx) {
        // 区域
        ctx.beginPath();
        ctx.fillStyle = this.touching ? this.renderArea.speedUpColor : this.renderArea.color;
        ctx.arc( this.position.x, this.position.y, this.renderArea.radius , 0 , 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}
