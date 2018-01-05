import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SpeedUp } from '../factory/speedUp';

@Component({
  selector: 'app-speed-up',
  templateUrl: './speed-up.component.html',
  styleUrls: ['./speed-up.component.scss']
})
export class SpeedUpComponent implements OnInit {
  @ViewChild('speedUp') canvas: ElementRef;
  speedUp: SpeedUp;
  ctx: any;

  constructor() {
    this.speedUp = new SpeedUp();
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.render();
  }

  render() {
    this.speedUp.render(this.ctx);
    requestAnimationFrame(this.render.bind(this));
  }

  handleTouch(event) {
    switch (event.type) {
      case 'touchstart':
        this.speedUp.handleTouchstart(event);
        break;
      case 'touchend':
        this.speedUp.handleTouchend(event);
        break;
      default: break;
    }
  }


}
