import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionboxControlComponent } from './optionbox-control.component';

describe('OptionboxControlComponent', () => {
  let component: OptionboxControlComponent;
  let fixture: ComponentFixture<OptionboxControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionboxControlComponent]
    });
    fixture = TestBed.createComponent(OptionboxControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
