import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { JoystickComponent } from './joystick/joystick.component';
import { MenuComponent } from './menu/menu.component';
import { RankComponent } from './rank/rank.component';


@NgModule({
  declarations: [
    AppComponent,
    JoystickComponent,
    MenuComponent,
    RankComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
