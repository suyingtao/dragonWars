import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { JoystickComponent } from './joystick/joystick.component';
import { MenuComponent } from './menu/menu.component';
import { RankComponent } from './rank/rank.component';
import { SpeedUpComponent } from './speed-up/speed-up.component';


@NgModule({
  declarations: [
    AppComponent,
    JoystickComponent,
    MenuComponent,
    RankComponent,
    SpeedUpComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
