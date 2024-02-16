import { RootLayout } from "./entry-layout.interface";
import { InputJobData } from "./input-jobdata.interface";

export interface DocumentInfo {
  dcn: string;
  entryLayout: RootLayout;
  inputJobData: InputJobData
}
