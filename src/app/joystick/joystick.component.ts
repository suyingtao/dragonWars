import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Joystick } from '../factory/joystick';
import { WsService } from '../ws/ws.service';

@Component({
  selector: 'app-joystick',
  templateUrl: './joystick.component.html',
  styleUrls: ['./joystick.component.scss']
})
export class JoystickComponent implements OnInit {
  @ViewChild('joystick') canvas: ElementRef;
  @Input() mode = 0;
  joystick: Joystick;
  ctx: any;
  size: number;
  clientWidth: number;

  constructor(private wsService: WsService) {
    this.joystick = new Joystick();
  }

  ngOnInit() {
    this.initSize();
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
        if (this.mode === 1) {
          this.wsService.changeDirc(this.joystick.angle);
        }
        break;
      case 'touchend':
        this.joystick.handleTouchend(event);
        break;
      default: break;
    }
  }

  render() {
    if (this.clientWidth !== document.body.clientWidth) {
      this.initSize();
    }
    this.joystick.render(this.ctx);
    requestAnimationFrame(this.render.bind(this));
  }

  initSize() {
    this.clientWidth = document.body.clientWidth;
    this.size = this.clientWidth / 5 > 100 ? 100 : this.clientWidth / 5;
    this.joystick = new Joystick(
      {x: this.size / 2, y: this.size / 2},
      {
        color: '#e5e5e5',
        radius: this.size / 2
      },
      {
        position: {
          x: 0,
          y: 0
        },
        color: '#aaa',
        radius: this.size / 5
      }
    );
  }
}
