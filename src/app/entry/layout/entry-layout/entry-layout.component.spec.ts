import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryLayoutComponent } from './entry-layout.component';

describe('EntryLayoutComponent', () => {
  let component: EntryLayoutComponent;
  let fixture: ComponentFixture<EntryLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntryLayoutComponent]
    });
    fixture = TestBed.createComponent(EntryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
