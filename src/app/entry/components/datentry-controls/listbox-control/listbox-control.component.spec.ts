import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListboxControlComponent } from './listbox-control.component';

describe('ListboxControlComponent', () => {
  let component: ListboxControlComponent;
  let fixture: ComponentFixture<ListboxControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListboxControlComponent]
    });
    fixture = TestBed.createComponent(ListboxControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
