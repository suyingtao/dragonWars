import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit {

  @Input() score = 0;
  time = 0;
  timer;
  constructor() { }

  ngOnInit() {
  }

  start() {
    this.timer = setInterval(() => {
      this.time += 1;
    }, 1000);
  }

  resetTime() {
    this.time = 0;

    try {
      clearInterval(this.timer);
    } catch (err) {
      console.log(err);
    }
  }

}
