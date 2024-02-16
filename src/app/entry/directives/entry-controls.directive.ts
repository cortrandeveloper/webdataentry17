import { ContentChild, ContentChildren, Directive, QueryList } from "@angular/core";
import { NgControl } from "@angular/forms";
import { SelectGroupDirective } from "./select-group.directive";
import { merge } from "rxjs";

@Directive({ selector: '[xentry-controls]' })
export class EntryControlsDirective {
  @ContentChildren(NgControl, { descendants: true }) controls?: QueryList<NgControl>;
  //@ContentChild(SelectGroupDirective) selectGroup?: SelectGroupDirective;

  ngAfterContentInit() {
    console.log(this.controls);
    // this.selectGroup?.checkChanges$.subscribe((checked) => {
    //   this.controls?.forEach(({ control }) => control?.patchValue(checked));
    // });

    // const changes = this.controls?.map(({ control }) => control?.valueChanges);

    // if (changes) {
    //   merge(...changes).subscribe(() => {

    //     if (this.selectGroup) {
    //       this.selectGroup.checked =
    //         this.controls?.toArray().every(({ control }) => control?.value) || false;
    //     }
    //   });
    // }
  }
}
