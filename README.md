# 基本介绍

一款移动端贪吃蛇大作战游戏。(只支持移动端)  

这是一个课设项目，由于时间紧迫，为了方便，我使用angular-cli直接生成了TypeScript的项目结构，并不建议使用angular。  

游戏的玩法和贪吃蛇大作战基本一致。左侧摇杆控制方向，右侧按钮加速，当你控制的贪吃蛇头部碰撞到墙壁或其他贪吃蛇时，Gameover。  

# [Demo请使用移动设备访问verysao.com/dragon](http://verysao.com/dragon)  

## 游戏截图  
![img](https://github.com/suyingtao/dragonWars/blob/master/screenshot/start.png)  
暂时未开放多人模式  

## 本地运行

```
    npm i // 安装依赖
    ng serve -p 0 // 本地启动
```
## 文件结构  

主要代码都位于src/app内，以下是app文件夹内的目录结构及文件说明。  
此外，在src/assets内也有一些图片或自己修改的第三方js库。  
```
.
|____app.component.html
|____gameover
| |____gameover.component.scss
| |____gameover.component.html
| |____gameover.component.ts        游戏结束弹窗
| |____gameover.component.spec.ts
|____room
| |____room.component.scss
| |____room.component.ts        多人模式下的房间（未开发）
| |____room.component.html
| |____room.component.spec.ts
|____app.component.scss
|____app.component.spec.ts
|____app.module.ts
|____app.component.ts       游戏核心逻辑、渲染主画面
|____speed-up
| |____speed-up.component.html
| |____speed-up.component.scss
| |____speed-up.component.ts        加速按钮
| |____speed-up.component.spec.ts
|____menu
| |____menu.component.ts        主菜单
| |____menu.component.spec.ts
| |____menu.component.html
| |____menu.component.scss
|____joystick
| |____joystick.component.spec.ts
| |____joystick.component.scss
| |____joystick.component.html
| |____joystick.component.ts        摇杆按钮
|____rank
| |____rank.component.html
| |____rank.component.spec.ts
| |____rank.component.scss
| |____rank.component.ts        积分榜
|____factory        类
| |____speedUp.ts       加速类
| |____food.ts      食物类
| |____joystick.ts      摇杆类
| |____dragon.ts        贪吃蛇类
|____ws
| |____ws.service.ts        websocket服务（用于多人游戏）
```
## 渲染原理  

使用canvas绘制游戏画面。  
在app.component.ts的ngOnInit中渲染摇杆及加速按钮，因为这两部分是不变的，不需要不断地重新绘制。  
渲染的主要函数为app.component.ts内的render函数，依次绘制出地图、食物、贪吃蛇，先绘制的会位于底层。  
在render函数内使用了 clearRect(0, 0, this.width, this.height) 和 requestAnimationFrame(this.render.bind(this)) 不断地清空、绘制、清空、绘制。  

## Q&A  

- 如何贪吃蛇始终位于屏幕中心？  

原理是当贪吃蛇移动时，让地图随着贪吃蛇相反的方向偏移，这样就使得贪吃蛇一直位于屏幕中心了。  

- 贪吃蛇的身体如何跟随头部移动？

需要分为两种情况，在单位时间内贪吃蛇移动一单位长度 和 贪吃蛇移动多单位长度。  
一单位长度时比较简单，只需将旧的头部左边unshift进body数组，body数组pop掉最后一个，然后给头部赋新值。  
多单位长度时，需要计算出旧头部移动到新头部可能出现的坐标，然后依次unshift进body数组内，body再pop掉多余的坐标。  


# DragonWars

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
