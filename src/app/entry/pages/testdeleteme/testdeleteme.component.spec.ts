import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestdeletemeComponent } from './testdeleteme.component';

describe('TestdeletemeComponent', () => {
  let component: TestdeletemeComponent;
  let fixture: ComponentFixture<TestdeletemeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestdeletemeComponent]
    });
    fixture = TestBed.createComponent(TestdeletemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
