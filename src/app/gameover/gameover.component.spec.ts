import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameoverComponent } from './gameover.component';

describe('GameoverComponent', () => {
  let component: GameoverComponent;
  let fixture: ComponentFixture<GameoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
