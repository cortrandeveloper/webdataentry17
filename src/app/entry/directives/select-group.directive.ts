import { Directive, ElementRef, Input } from "@angular/core";
import { fromEvent, map, tap } from "rxjs";

@Directive({ selector: '[selectGroup]' })
export class SelectGroupDirective {

  checkChanges$ = fromEvent<any>(this.host.nativeElement, 'change').pipe(
    tap((e) => console.log(e)),
    map((e) => e.target?.checked)
  );

  constructor(private host: ElementRef<HTMLInputElement>) {
    //console.log('selectGroup ctor ', {host});
  }

  set checked(checked: boolean) {
    this.host.nativeElement.checked = checked;
    //console.log('selectGroup-checked: ', { checked });
    //console.log('selectGroup-checked2: ', this.multiOption );
  }

  //@Input() multiOption: boolean = false;
}
