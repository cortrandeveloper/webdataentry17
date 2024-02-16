import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkbox-sample',
  templateUrl: './checkbox-sample.component.html',
  styleUrls: ['./checkbox-sample.component.css']
})
export class CheckboxSampleComponent {

  items = [
    { name: 'One', id: 1, group: 'A' },
    { name: 'Two', id: 2, group: 'A' },
    { name: 'Three', id: 3, group: 'A' },
    { name: 'Four', id: 4, group: 'B' },
    { name: 'Five', id: 5, group: 'B' },
    { name: 'Six', id: 6, group: 'B' },
  ]

  public form = new FormGroup({
    items: new FormArray([])
  });

  ngOnInit() {
    this.items.forEach(() => this.controls.push(new FormControl()))
  }

  get controls() {
    return this.form.get('items') as FormArray;
  }
}
