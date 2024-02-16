import { FormControl, FormGroup } from "@angular/forms";
import { ControlState } from "./control-state.interface";
import { Behavior, ItemLayout } from "./entry-layout.interface";
import { InputFieldData } from "./input-jobdata.interface";

export interface ControlInfo {
  name: string;
  controlState: ControlState;
  controlInput: FormControl | FormGroup;
  controlLayout: ItemLayout;
  controlInputJobData: InputFieldData;
  entryBehavior: Behavior;
}
