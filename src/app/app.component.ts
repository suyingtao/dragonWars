import { Component, ViewChild, ElementRef } from '@angular/core';
import { Joystick } from './factory/joystick';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('canvas') canvas: ElementRef;
  ctx: any;
  joystick: Joystick;

  constructor (){
  }  
  ngOnInit() {
    this.joystick = new Joystick();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.render();
  }

  handleTouch(event) {
    console.log(event.type);
    switch(event.type){
      case "touchstart":
        this.joystick.handleTouchstart(event);
        break;
      case "touchmove":
        this.joystick.handleTouchmove(event);
        break;
      case "touchend":
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
