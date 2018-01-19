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
  size: number;
  clientWidth: number;

  constructor() {
    this.initSize();
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.render();

  }

  render() {
    if (this.clientWidth !== document.body.clientWidth) {
      this.initSize();
    }
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

  initSize() {
    this.clientWidth = document.body.clientWidth;
    this.size = this.clientWidth / 5 > 100 ? 100 : this.clientWidth / 5;
    this.speedUp = new SpeedUp({x: this.size / 2, y: this.size / 2}, {
      color: '#e5e5e5',
      speedUpColor: '#ccc',
      radius: this.size / 2
    });
  }


}
