import { Component, ViewChild, ElementRef, ComponentRef, OnInit } from '@angular/core';
import { Dragon } from './factory/dragon';
import { Position, Food } from './factory/food';
import { Joystick } from './factory/joystick';
import { JoystickComponent } from './joystick/joystick.component';
import { SpeedUp } from './factory/speedUp';
import { SpeedUpComponent } from './speed-up/speed-up.component';
import { WsService } from './ws/ws.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('canvas') groud: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('joystick') joystick: JoystickComponent;
  @ViewChild('speedUp') speedUp: SpeedUpComponent;

  ctx: any;
  gridSize = 20;
  gridColor = '#f6f6f6';
  height = 800;
  width = 800;
  dragon: Dragon;
  bot: Array<Dragon> = [];
  botTimer;
  lastDate: number;
  screenCenter = {
    x: 0,
    y: 0
  };
  start = false;
  startTime;
  endTime;
  mode = 0;

  // visibility
  menuVisibility = true;
  gameoverVisibility = false;
  // 加速系数
  speedUpCoefficient = 1.6;

  // foods
  foods: Array<Food> = [];

  constructor (private wsService: WsService) {
  }

  initGame() {
    this.startTime = Date.now();
    this.joystick.joystick.init();
    this.speedUp.speedUp.init();
    this.dragon = new Dragon(
      'test',
      {x: 150, y: 150},
      0,
      200,
      [{x: 150, y: 151}, {x: 150, y: 152}, {x: 150, y: 153}, {x: 149, y: 153}, {x: 148, y: 153}, {x: 147, y: 152}, {x: 147, y: 151},
        {x: 147, y: 152}, {x: 147, y: 153}, {x: 147, y: 154}, {x: 147, y: 155}, {x: 147, y: 156}, {x: 147, y: 157}, {x: 147, y: 158},
        {x: 147, y: 159}, {x: 147, y: 160}, {x: 147, y: 161}, {x: 147, y: 162}],
      0,
      '#FF4040'
    );
    this.bot = [];
    this.foods = [];
    this.lastDate = null;

    for (let i = 0; i < 10; i++) {
      this.generatorBot();
    }

    for (let i = 0; i < 10; i++) {
      this.generatorFood();
    }

    clearInterval(this.botTimer);
    this.botTimer = setInterval(() => {
      for (let i = 0; i < 15; i++) {
        this.generatorFood();
        this.generatorBot();
      }
    }, 5000);

    this.render();
  }

  initOnlineGame() {
    this.joystick.joystick.init();
    this.speedUp.speedUp.init();
    this.onlineRender();
  }

  ngOnInit() {
    this.ctx = this.groud.nativeElement.getContext('2d');

    if (window.devicePixelRatio) {
      this.groud.nativeElement.style.width = this.width + 'px';
      this.groud.nativeElement.style.height = this.height + 'px';
      this.groud.nativeElement.height = this.height * window.devicePixelRatio;
      this.groud.nativeElement.width = this.width * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

  }

  clearCtx(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  renderGroud(ctx, position: Position) {
    this.groud.nativeElement.style.transform
      = 'translate(' + (this.screenCenter.x - position.x) + 'px,' + (this.screenCenter.y - position.y) + 'px)';
    ctx.lineWidth = 1;

    for (let x = 0; x < this.height / this.gridSize; x++) {
      ctx.beginPath();
      ctx.lineTo(0, x * this.gridSize);
      ctx.lineTo(this.height, x * this.gridSize);
      ctx.strokeStyle = this.gridColor;
      ctx.stroke();
    }
    for (let x = 0; x < this.width / this.gridSize; x++) {
      ctx.beginPath();
      ctx.lineTo(x * this.gridSize, 0);
      ctx.lineTo(x * this.gridSize, this.width);
      ctx.strokeStyle = this.gridColor;
      ctx.stroke();
    }
  }

  onlineRender() {
    this.screenCenter = {
      x: this.container.nativeElement.offsetWidth / 2,
      y: this.container.nativeElement.offsetHeight / 2
    };

    this.clearCtx(this.ctx);

    this.renderGroud(this.ctx, this.wsService.dragons[this.wsService.id].header);

    for (const i in this.wsService.dragons) {
      if (this.wsService.dragons[i]) {
        this.renderDragon(this.ctx, this.wsService.dragons[i]);
      }
    }

    if (this.start) {
      requestAnimationFrame(this.onlineRender.bind(this));
    }
  }

  render() {
    this.screenCenter = {
      x: this.container.nativeElement.offsetWidth / 2,
      y: this.container.nativeElement.offsetHeight / 2
    };

    this.clearCtx(this.ctx);

    const now = Date.now();
    if (!this.lastDate) {
      this.lastDate = now;
    }
    this.update(now - this.lastDate);

    this.renderGroud(this.ctx, this.dragon.header);

    this.foods.forEach((food) => {
      food.render(this.ctx);
    });

    this.dragon.render(this.ctx);

    for (const i in this.bot) {
      if (this.bot[i]) {
        this.bot[i].render(this.ctx);
      }
    }

    if (this.collisionDetection()) {
      this.gameOver();
    }

    this.lastDate = now;

    if (this.start) {
      requestAnimationFrame(this.render.bind(this));
    }
  }

  renderDragon(ctx, dragon) {
    if (!dragon.alive) {
        return ;
    }

    // draw body
    ctx.beginPath();
    ctx.moveTo(dragon.header.x, dragon.header.y);
    dragon.body.forEach((position, index) => {
        ctx.lineTo(position.x, position.y);
    });
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = dragon.radius * 2;
    ctx.strokeStyle = dragon.color;
    ctx.stroke();
    ctx.closePath();

    // draw header
    ctx.beginPath();
    ctx.fillStyle = dragon.headerColor;
    ctx.arc(dragon.header.x, dragon.header.y, dragon.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    // eyes
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(
        dragon.header.x + (dragon.radius - 2) * Math.cos(Math.PI * (dragon.direction - 90) / 180),
        dragon.header.y - (dragon.radius - 2) * Math.sin(Math.PI * (dragon.direction - 90) / 180),
        2,
        0,
        2 * Math.PI
    );
    ctx.arc(
        dragon.header.x + (dragon.radius - 2) * Math.cos(Math.PI * (dragon.direction + 90) / 180),
        dragon.header.y - (dragon.radius - 2) * Math.sin(Math.PI * (dragon.direction + 90) / 180),
        2,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(
        dragon.header.x + (dragon.radius - 2) * Math.cos(Math.PI * (dragon.direction - 90) / 180),
        dragon.header.y - (dragon.radius - 2) * Math.sin(Math.PI * (dragon.direction - 90) / 180),
        1,
        0,
        2 * Math.PI
    );
    ctx.arc(
        dragon.header.x + (dragon.radius - 2) * Math.cos(Math.PI * (dragon.direction + 90) / 180),
        dragon.header.y - (dragon.radius - 2) * Math.sin(Math.PI * (dragon.direction + 90) / 180),
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
        dragon.header.x + (dragon.radius - 2) * Math.cos(Math.PI * (dragon.direction) / 180),
        dragon.header.y - (dragon.radius - 2) * Math.sin(Math.PI * (dragon.direction) / 180),
        1,
        0,
        2 * Math.PI
    );
    ctx.fill();
    ctx.closePath();

    // invincible
    if (dragon.invincible && !dragon.bornInvincibleTimer) {
        dragon.bornInvincibleTimer = setTimeout(() => {
            dragon.invincible = false;
        }, dragon.bornInvincibleTime * 1000);
    }

    if (dragon.invincible) {
        ctx.beginPath();
        let maxD = 0;
        for (let i = 0; i < dragon.body.length; i++) {
            const dx = dragon.body[i].x - dragon.header.x;
            const dy = dragon.body[i].y - dragon.header.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > maxD) {
                maxD = d;
            }
        }
        ctx.arc(
            dragon.header.x,
            dragon.header.y,
            dragon.radius + maxD + 5,
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

  update(space) {
    if (space >= 30) {
      space = 30;
    }
    this.dragon.move(this.joystick.joystick.angle, this.speedUp.speedUp.touching ? space * this.speedUpCoefficient : space);
    for (const i in this.bot) {
      if (this.bot[i]) {
        this.bot[i].move(this.randomDirection(this.bot[i]), space);
      }
    }
  }

  /**
   * bot 随机方向
   * @param d
   */
  randomDirection(d: Dragon) {
    const estimates = 70;
    const now = Date.now();

    if (now - d.lastRandomDirc <= 300) {
      return d.direction;
    }

    if (Math.abs((d.header.x - this.width / 2)) + estimates >= this.width / 2 - d.radius) {
      let t = Math.random() > 0.5 ? d.direction + 150 : d.direction - 150;

      t = t > 0 ? t % 360 : 360 + t;
      d.lastRandomDirc = now;
      d.direction = t;
    }

    if (Math.abs((d.header.y - this.height / 2)) + estimates >= this.height / 2 - d.radius) {
      let t = Math.random() > 0.5 ? d.direction + 150 : d.direction - 150;
      t = t > 0 ? t % 360 : 360 + t;

      d.lastRandomDirc = now;
      d.direction = t;
    }

    if (Math.random() >= 0.99) {

      d.lastRandomDirc = now;
      d.direction = Math.random() * 360;
    }

    return d.direction;
  }


  /**
   * @desc 碰撞检测
   */
  collisionDetection() {
    // 人撞墙
    if (this.wallCollisionJudge(this.dragon)) {
      this.dragonDie(this.dragon);
      return true;
    }

    // 人吃食物
    for (let i = 0; i < this.foods.length; i++) {
      if (this.eatJudge(this.dragon, this.foods[i])) {
        this.eat(this.dragon, this.foods[i]);
        i--;
      }
    }
    for (let i = 0; i < this.bot.length; i++) {
      // 机器人 eat food
      for (let j = 0; j < this.foods.length; j++) {
        if (this.eatJudge(this.bot[i], this.foods[j])) {
          this.eat(this.bot[i], this.foods[j]);
          j--;
        }
      }
      // 机器人撞墙
      if (this.wallCollisionJudge(this.bot[i])) {
        this.dragonDie(this.bot[i]);
        this.bot.splice(i, 1);
        i--;
        break;
      }

      // 机器人撞人
      if (this.dragonCollisionJudge(this.bot[i], this.dragon)) {
        this.dragonDie(this.bot[i]);
        this.bot.splice(i, 1);
        i--;
        break;
      }

      // 人撞机器人
      if (this.dragonCollisionJudge(this.dragon, this.bot[i])) {
        return true;
      }

      // 机器人撞机器人
      for (let j = 0; j < this.bot.length; j++) {
        if (i !== j && this.dragonCollisionJudge(this.bot[i], this.bot[j])) {
          this.dragonDie(this.bot[i]);
          this.bot.splice(i, 1);
          i--;
          break;
        }
      }
    }

    return false;
  }

  /**
   * @desc 撞墙检测
   * @param dragon: Dragon
   */
  wallCollisionJudge(dragon: Dragon) {
    if (Math.abs((dragon.header.x - this.width / 2)) >= this.width / 2 - dragon.radius) {
      return true;
    }

    if (Math.abs((dragon.header.y - this.height / 2)) >= this.height / 2 - dragon.radius) {
      return true;
    }

    return false;
  }

  /**
   * @desc 龙龙碰撞检测
   * @param s: Dragon
   * @param t: Dragon
   */
  dragonCollisionJudge(s: Dragon, t: Dragon) {
    if (s.invincible || t.invincible) {
      return false;
    }

    const minD = s.radius + t.radius;

    const hdx = t.header.x - s.header.x;
    const hdy = t.header.y - s.header.y;
    const hd = Math.sqrt(hdx * hdx + hdy * hdy);
    if (hd <= minD && s.body.length < t.body.length) {
      return true;
    }

    for (let i = 0; i < t.body.length; i++) {
      const dx = t.body[i].x - s.header.x;
      const dy = t.body[i].y - s.header.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d <= minD) {
        return true;
      }

    }

    return false;
  }

  startSingleGame() {
    this.start = true;
    this.menuVisibility = false;

    this.initGame();
  }

  startOnlineGame() {
    this.start = true;
    this.menuVisibility = false;
    this.mode = 1;

    // this.wsService.joinGame().subscribe(()=>{
    this.initOnlineGame();
    // });
  }

  gameOver() {
    this.endTime = Date.now();
    this.start = false;
    this.gameoverVisibility = true;
    this.menuVisibility = true;
  }

  generatorBot() {
    const header = {
      x: Math.floor(Math.random() * (this.width - 50)) + 70,
      y: Math.floor(Math.random() * (this.height - 50)) + 50,
    };
    const body = [];

    for (let i = 1; i < 20; i++) {
      body.push({
        x: header.x - i,
        y: header.y
      });
    }

    this.bot.push(new Dragon(
      'bot',
      header,
      Math.floor(Math.random() * 360),
      150,
      body,
      0,
      '#' + Math.floor(Math.random() * 0xffffff).toString(16)
    ));
  }

  generatorFood(p?: Position, energy?: number) {
    if (!p) {
      p = {
        x: Math.floor(Math.random() * this.width),
        y: Math.floor(Math.random() * this.height)
      };
    }

    if (!energy) {
      energy = Math.ceil(Math.random() * 5);
    }

    this.foods.push(new Food(p, energy));
  }

  addFoods(f: Array<Food>) {
    f.forEach((fd) => {
      this.foods.push(fd);
    });
  }



  eatJudge(dragon: Dragon, food: Food) {
    const eatRadius = 10;
    if (!food.alive) {
      return false;
    }
    const dx = dragon.header.x - food.position.x;
    const dy = dragon.header.y - food.position.y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d <= dragon.radius + food.radius + eatRadius) {
      return true;
    }

    return false;
  }

  eat(dragon: Dragon, food: Food) {
    const energy = food.energy;
    food.die();
    let t = 0;
    const timer = setInterval(() => {
      const dx = dragon.header.x - food.position.x - dragon.radius - food.radius;
      const dy = dragon.header.y - food.position.y - dragon.radius - food.radius;
      food.position.x += dx / 5;
      food.position.y += dy / 5;
      t++;
      if (t === 5) {
        clearInterval(timer);
        this.foods.splice(this.foods.indexOf(food), 1);
        dragon.grow(dragon.body[dragon.body.length - 1], energy);
      }
    }, 40);
  }

  dragonDie(dragon: Dragon) {
    let positons = dragon.die();

    const energy = Math.ceil(positons.length / 25);

    positons = positons.filter((v, i) => {
      return i % (energy * 5) === 0;
    });

    positons.forEach((p) => {
       this.generatorFood(p, energy);
    });
  }
}
