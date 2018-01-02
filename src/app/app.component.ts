import { Component, ViewChild, ElementRef, ComponentRef } from '@angular/core';
import { Dragon } from './factory/dragon';
import { Joystick } from './factory/joystick';
import { JoystickComponent } from './joystick/joystick.component'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('canvas') groud: ElementRef;
  @ViewChild('container') container: ElementRef;
  @ViewChild('joystick') joystick: JoystickComponent;
  ctx: any;
  gridSize: number = 20;
  gridColor: string = '#f6f6f6';
  height: number = 800;
  width: number = 800;
  dragon: Dragon;
  bot: Dragon;
  lastDate: number;
  x: 200;
  y: 0;
  screenCenter = {
    x: 0,
    y: 0
  };
  constructor (){
    this.dragon = new Dragon(
      'test',
      {x: 150, y: 150},
      0,
      200,
      [{x: 150, y: 151}, {x: 150, y: 152}, {x: 150, y: 153}, {x: 149, y: 153}, {x: 148, y: 153}, {x: 147, y: 152}, {x: 147, y: 151}],
      0,
      '#FF4040'
    );
    this.bot = new Dragon(
      'bot',
      {x: 150, y: 160},
      0,
      100,
      [],
      0,
      '#000'
    )
  }

  ngOnInit() {
    this.ctx = this.groud.nativeElement.getContext('2d');
    if (window.devicePixelRatio) {
      this.groud.nativeElement.style.width = this.width + "px";
      this.groud.nativeElement.style.height = this.height + "px";
      this.groud.nativeElement.height = this.height * window.devicePixelRatio;
      this.groud.nativeElement.width = this.width * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    this.render();
    this.screenCenter = {
      x: this.container.nativeElement.offsetWidth / 2,
      y: this.container.nativeElement.offsetHeight / 2
    }
  }

  clearCtx(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  renderGroud(ctx) {
    this.groud.nativeElement.style.transform = 'translate(' + (this.screenCenter.x - this.dragon.header.x) + 'px,' + (this.screenCenter.y - this.dragon.header.y) + 'px)';
    ctx.lineWidth = 1;
    for(let x = 0; x < this.height / this.gridSize; x++) {
      ctx.beginPath();
      ctx.lineTo(0, x * this.gridSize);
      ctx.lineTo(this.height, x * this.gridSize);
      ctx.strokeStyle = this.gridColor;
      ctx.stroke();
    }
    for(let x = 0; x < this.width / this.gridSize; x++) {
      ctx.beginPath();
      ctx.lineTo(x * this.gridSize, 0);
      ctx.lineTo(x * this.gridSize, this.width);
      ctx.strokeStyle = this.gridColor;
      ctx.stroke();
    }
  }

  render() {
    this.clearCtx(this.ctx);
    const now = Date.now();
    if(!this.lastDate) {
      this.lastDate = now;
    }
    this.update(now - this.lastDate);
    this.renderGroud(this.ctx);
    this.dragon.render(this.ctx);
    //this.bot.render(this.ctx);
    this.lastDate = now;
    requestAnimationFrame(this.render.bind(this));
  }

  update(space) {
    // if (this.joystick.joystick.touching) {
    //   if (Math.abs(this.joystick.joystick.angle - this.dragon.direction) < 180) {
    //     if (this.joystick.joystick.angle - this.dragon.direction>0) {
    //     this.dragon.direction += 0.12 * space;
    //     }
    //     if (this.joystick.joystick.angle - this.dragon.direction<0) {
    //     this.dragon.direction -= 0.12 * space;
    //     }
    //   }
    //   if (Math.abs(this.joystick.joystick.angle - this.dragon.direction)>180) {
    //     if (this.joystick.joystick.angle - this.dragon.direction>0) {
    //     this.dragon.direction -= 0.12 * space;
    //     }
    //     if (this.joystick.joystick.angle - this.dragon.direction<0) {
    //     this.dragon.direction += 0.12 * space;
    //     }
    //   }
    //   if (this.dragon.direction>360) {
    //     this.dragon.direction -= 360;
    //   }
    //   if (this.dragon.direction<0) {
    //     this.dragon.direction += 360;
    //   }
    // }
    this.dragon.move(this.joystick.joystick.angle, space);
    //this.bot.move(5, space);
    // for(let i = this.dragon.body.length - 1; i>0; i--) {
    //   this.dragon.body[i].x = this.dragon.body[i - 1].x;
    //   this.dragon.body[i].y = this.dragon.body[i - 1].y;
    // }
    // this.dragon.body[0].x = this.dragon.header.x;
    // this.dragon.body[0].y = this.dragon.header.y;
    // const moveX = this.dragon.speed * space / 1000 * Math.cos(Math.PI * this.dragon.direction / 180);
    // const moveY = this.dragon.speed * space / 1000 * Math.sin(Math.PI * this.dragon.direction / 180);
    // const moveDistance = Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2));
    // this.dragon.header.x += moveX;
    // this.dragon.header.y += moveY;
    
    // for(let i in this.dragon.body) {
    //   this.dragon.body[i].x += x;
    //   this.dragon.body[i].y += y;
    // }
    
  }
}
