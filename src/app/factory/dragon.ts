interface Position {
    x: number;
    y: number;
}

export class Dragon {
    name: string;

    header: Position;
    body: Array<Position>;
    alive = true;
    radius = 8;

    color: string;
    headerColor: string;

    // 单位像素/s
    speed: number;
    direction: number;

    // 转向速度 angle/ms
    turnSpeed = 0.5;
    lastRandomDirc = 0;
    moveDistance = 0;

    // 得分
    score: number;

    // 无敌
    invincible = true;
    bornInvincibleTime = 2;
    bornInvincibleTimer;

    constructor(
        name: string = 'unknown',
        header: Position,
        direction: number,
        speed: number,
        body: Array<Position>,
        score: number,
        color: string,
        headerColor: string = 'red',
    ) {
        this.name = name;
        this.header = header;
        this.direction = direction;
        this.speed = speed;
        this.body = body;
        this.score = score;
        this.color = color;
        this.headerColor = headerColor;
    }

    render(ctx) {
        if (!this.alive) {
            return ;
        }

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
        ctx.fillStyle = this.headerColor;
        ctx.arc(this.header.x, this.header.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // eyes
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(
            this.header.x + (this.radius - 2) * Math.cos(Math.PI * (this.direction - 90) / 180),
            this.header.y - (this.radius - 2) * Math.sin(Math.PI * (this.direction - 90) / 180),
            2,
            0,
            2 * Math.PI
        );
        ctx.arc(
            this.header.x + (this.radius - 2) * Math.cos(Math.PI * (this.direction + 90) / 180),
            this.header.y - (this.radius - 2) * Math.sin(Math.PI * (this.direction + 90) / 180),
            2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(
            this.header.x + (this.radius - 2) * Math.cos(Math.PI * (this.direction - 90) / 180),
            this.header.y - (this.radius - 2) * Math.sin(Math.PI * (this.direction - 90) / 180),
            1,
            0,
            2 * Math.PI
        );
        ctx.arc(
            this.header.x + (this.radius - 2) * Math.cos(Math.PI * (this.direction + 90) / 180),
            this.header.y - (this.radius - 2) * Math.sin(Math.PI * (this.direction + 90) / 180),
            1,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();

        // mouse
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(
            this.header.x + (this.radius - 2) * Math.cos(Math.PI * (this.direction) / 180),
            this.header.y - (this.radius - 2) * Math.sin(Math.PI * (this.direction) / 180),
            1,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();

        // invincible
        if (this.invincible && !this.bornInvincibleTimer) {
            this.bornInvincibleTimer = setTimeout(() => {
                this.invincible = false;
            }, this.bornInvincibleTime * 1000);
        }

        if (this.invincible) {
            ctx.beginPath();
            let maxD = 0;
            for (let i = 0; i < this.body.length; i++) {
                const dx = this.body[i].x - this.header.x;
                const dy = this.body[i].y - this.header.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d > maxD) {
                    maxD = d;
                }
            }
            ctx.arc(
                this.header.x,
                this.header.y,
                this.radius + maxD + 5,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = 'rgba(230, 230, 45, 0.1)';
            ctx.fill();
            ctx.closePath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(250, 250, 50, 0.5)';
            ctx.stroke();
        }
    }

    move(angle: number, space: number) {
        const tempRadius = Math.floor(7 + this.body.length / 100);

        this.radius = tempRadius > 15 ? 15 : tempRadius;

        this.speed = 45 + 800 / this.radius;

        // 转向速度 angle/ms
        const turnSpeed = this.turnSpeed;

        if (Math.abs(angle - this.direction) < 180) {
            if (angle - this.direction > 0) {
                if (turnSpeed * space > angle - this.direction) {
                    this.direction = angle;
                } else {
                    this.direction += turnSpeed * space;
                }
            } else if (angle - this.direction < 0) {
                if (turnSpeed * space > this.direction - angle) {
                    this.direction = angle;
                } else {
                    this.direction -= turnSpeed * space;
                }
            }
        }

        if (Math.abs(angle - this.direction) > 180) {
            if (angle - this.direction > 0) {
                this.direction -= turnSpeed * space;

                if (this.direction < 0) {
                    this.direction += 360;
                    if (this.direction < angle) {
                        this.direction = angle;
                    }
                }

            } else if (angle - this.direction < 0) {
                this.direction += turnSpeed * space;

                if (this.direction > 360) {
                    this.direction -= 360;
                }

                if (this.direction > angle) {
                    this.direction = angle;
                }
            }
        }

        // if (this.direction > 360) {
        //     this.direction -= 360;
        // }
        // if (this.direction < 0) {
        //     this.direction += 360;
        // }

        // 立即转向
        // this.direction = angle;

        const moveX = parseFloat((this.speed * space / 1000 * Math.cos(Math.PI * this.direction / 180)).toFixed(2));
        const moveY = parseFloat((this.speed * space / 1000 * Math.sin(Math.PI * this.direction / 180)).toFixed(2));
        const moveDistance = parseFloat((this.speed * space / 1000).toFixed(2));

        this.moveDistance += moveDistance;
        this.bodyMove({x: this.header.x + moveX, y: parseFloat((this.header.y - moveY).toFixed(2))});
        this.header.x += moveX;
        this.header.y -= moveY;
    }

    bodyMove(newHeader: Position) {

        if (this.moveDistance >= 1 && this.moveDistance < 2) {
            this.moveDistance = 0;

            this.body.unshift({x: this.header.x, y: this.header.y});
            this.body.pop();
        }

        if (this.moveDistance >= 2) {
            this.moveDistance = 0;
            const bodyLen = this.body.length;
            const dx = newHeader.x - this.header.x;
            const dy = newHeader.y - this.header.y;
            const tempBody = [];

            this.body.unshift({x: this.header.x, y: this.header.y});

            if (Math.round(dx) === 0) {

                if (dy > 0) {
                    for (let y = newHeader.y - 1; Math.round(y) > Math.round(this.header.y) && tempBody.length < bodyLen; y--) {
                        tempBody.unshift({x: newHeader.x, y: y});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                if (dy < 0) {
                    for (let y = newHeader.y + 1; Math.round(y) < Math.round(this.header.y) && tempBody.length < bodyLen; y++) {
                        tempBody.unshift({x: newHeader.x, y: y});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                this.body.splice(bodyLen);
            }

            if (Math.round(dy) === 0) {

                if (dx > 0) {
                    for (let x = newHeader.x - 1; Math.round(x) > Math.round(this.header.x) && tempBody.length < bodyLen; x--) {
                        tempBody.unshift({x: x, y: newHeader.y});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                if (dx < 0) {
                    for (let x = newHeader.x + 1; Math.round(x) < Math.round(this.header.x) && tempBody.length < bodyLen; x++) {
                        tempBody.unshift({x: x, y: newHeader.y});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                this.body.splice(bodyLen);
            }

            if (Math.abs(Math.round(dy)) > 0 && Math.abs(Math.round(dx)) > 0) {
                // y = ax + b; x = (y - b) / a
                const a = this.parseNum(dy / dx, 2);
                const b = this.parseNum(newHeader.y - a * newHeader.x, 2);

                if (Math.abs(a) <= 1 && dx > 0) {
                    for (let x = Math.round(newHeader.x) - 1; Math.round(x) > Math.round(this.header.x) && tempBody.length < bodyLen; x--) {
                        tempBody.unshift({x: x, y: Math.round(a * x + b)});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                if (Math.abs(a) <= 1 && dx < 0) {
                    for (let x = Math.round(newHeader.x) + 1; Math.round(x) < Math.round(this.header.x) && tempBody.length < bodyLen; x++) {
                        tempBody.unshift({x: x, y: Math.round(a * x + b)});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                if (Math.abs(a) > 1 && dy > 0) {
                    for (let y = Math.round(newHeader.y) - 1; Math.round(y) > Math.round(this.header.y) && tempBody.length < bodyLen; y--) {
                        tempBody.unshift({x: Math.round((y - b) / a), y: y});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                if (Math.abs(a) > 1 && dy < 0) {
                    for (let y = Math.round(newHeader.y) + 1; Math.round(y) < Math.round(this.header.y) && tempBody.length < bodyLen; y++) {
                        tempBody.unshift({x: Math.round((y - b) / a), y: y});
                    }
                    for (let i = 0; i < tempBody.length; i++) {
                        this.body.unshift(tempBody[i]);
                    }
                }

                this.body.splice(bodyLen);
            }
        }
    }

    parseNum(num, n) {
        return parseFloat(num.toFixed(n));
    }

    grow(p: Position, energy: number = 1) {
        this.score += energy;

        if (this.body.length >= 300) {
            return;
        }
        for (let i = 0; i < energy; i++) {
            this.body.push(p);
        }

    }

    die() {
        this.alive = false;

        return [].concat(this.header, this.body);
    }
}
