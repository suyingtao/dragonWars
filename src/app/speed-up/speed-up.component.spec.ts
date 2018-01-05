import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedUpComponent } from './speed-up.component';

describe('SpeedUpComponent', () => {
  let component: SpeedUpComponent;
  let fixture: ComponentFixture<SpeedUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
