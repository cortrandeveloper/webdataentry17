import { ControlStatus } from "../enums/control-status.enum";

export interface ControlState{
  keyedBy?: string;
  keyNet: number;
  keyGross: number;
  status: ControlStatus;
  previousValue: string;
  isReadOnly: boolean;
}
