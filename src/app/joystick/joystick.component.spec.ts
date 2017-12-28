import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoystickComponent } from './joystick.component';

describe('JoystickComponent', () => {
  let component: JoystickComponent;
  let fixture: ComponentFixture<JoystickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoystickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoystickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
