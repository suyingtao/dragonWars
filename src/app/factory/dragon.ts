interface Position {
    x: number;
    y: number;
}

interface Circle {
    center: Position;
    radius: number;
}

/**
 * @desc 求两点间距离
 * @param a: Position
 * @param b: Position
 */
function len(a: Position, b: Position) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/**
 * @desc 求三角形外接圆
 * @param a
 * @param b
 * @param c
 */
function circleOfTriangle(a: Position, b: Position, c: Position): Circle {

    const a1 = 2 * (b.x - a.x),
          b1 = 2 * (b.y - a.y),
          c1 = b.x * b.x + b.y * b.y - a.x * a.x - a.y * a.y,
          a2 = 2 * (c.x - b.x),
          b2 = 2 * (c.y - b.y),
          c2 = c.x * c.x + c.y * c.y - b.x * b.x - b.y * b.y;

    const center = {
        x: (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1),
        y: (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1)
    };

    const circle = {
        center: center,
        radius: len(a, center)
    };

    return circle;
}

/**
 * @desc 最小覆盖圆
 */
function minCircle(pArr: Array<Position>) {
    let tempCircle = {
        center: pArr[0],
        radius: 0
    };

    for (let i = 0; i < pArr.length; i++) {
        if (len(pArr[i], tempCircle.center) > tempCircle.radius) {
            tempCircle.center = pArr[i];
            tempCircle.radius = 0;

            for (let j = 0; j < i; j++) {
                if (len(pArr[j], tempCircle.center) > tempCircle.radius) {
                    tempCircle.center = {
                        x: (pArr[i].x + pArr[j].x) / 2,
                        y: (pArr[i].y + pArr[j].y) / 2
                    };
                    tempCircle.radius = len(pArr[i], pArr[j]) / 2;

                    for (let k = 0; k < j; k++) {
                        if (len(pArr[k], tempCircle.center) > tempCircle.radius) {
                            tempCircle = circleOfTriangle(pArr[i], pArr[j], pArr[k]);
                        }
                    }
                }
            }
        }
    }

    return tempCircle;
}
export class Dragon {
    name: string;

    header: Position;
    body: Array<Position>;
    alive = true;
    radius: number;

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
            this.header.x + (this.radius - this.radius / 6) * Math.cos(Math.PI * (this.direction) / 180),
            this.header.y - (this.radius - this.radius / 6) * Math.sin(Math.PI * (this.direction) / 180),
            this.radius / 6,
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
            const circle = minCircle(this.body);
            ctx.beginPath();
            // let maxD = 0;
            // for (let i = 0; i < this.body.length; i++) {
            //     const dx = this.body[i].x - this.header.x;
            //     const dy = this.body[i].y - this.header.y;
            //     const d = Math.sqrt(dx * dx + dy * dy);
            //     if (d > maxD) {
            //         maxD = d;
            //     }
            // }
            ctx.arc(
                circle.center.x,
                circle.center.y,
                circle.radius + this.radius + 4,
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
                    if (this.direction > angle) {
                        this.direction = angle;
                    }
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
