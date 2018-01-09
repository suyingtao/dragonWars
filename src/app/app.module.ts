import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { JoystickComponent } from './joystick/joystick.component';
import { MenuComponent } from './menu/menu.component';
import { RankComponent } from './rank/rank.component';
import { SpeedUpComponent } from './speed-up/speed-up.component';

import { WsService } from './ws/ws.service';
import { RoomComponent } from './room/room.component';

@NgModule({
  declarations: [
    AppComponent,
    JoystickComponent,
    MenuComponent,
    RankComponent,
    SpeedUpComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
