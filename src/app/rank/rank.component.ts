import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent implements OnInit {

  @Input() score = 0;

  constructor() { }

  ngOnInit() {
  }

}
