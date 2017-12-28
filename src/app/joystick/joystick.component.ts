import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Joystick } from '../factory/joystick';
@Component({
  selector: 'app-joystick',
  templateUrl: './joystick.component.html',
  styleUrls: ['./joystick.component.scss']
})
export class JoystickComponent implements OnInit {
  @ViewChild('joystick') canvas: ElementRef;
  joystick: Joystick;
  ctx: any;

  constructor() {
    this.joystick = new Joystick();
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.render();
  }

  handleTouch(event) {
    switch (event.type) {
      case 'touchstart':
        this.joystick.handleTouchstart(event);
        break;
      case 'touchmove':
        this.joystick.handleTouchmove(event);
        break;
      case 'touchend':
        this.joystick.handleTouchend(event);
        break;
      default: break;
    }
  }

  render() {
    this.joystick.render(this.ctx);
    requestAnimationFrame(this.render.bind(this));
  }
}
