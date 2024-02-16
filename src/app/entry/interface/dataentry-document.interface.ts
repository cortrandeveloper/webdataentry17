import { InputJobData } from "./input-jobdata.interface";

export interface DataentryDocument {
  batchName:           string;
  currentJobData:      null;
  documentNumber:      string;
  documentStatus:      null;
  imageListPath:       null;
  imageInfoList:       ImageInfoList[];
  imagePath:           string;
  inputJobData:        null | InputJobData;//InputJobData
  inputJobDataZip:     null;
  interruptJobData:    null;
  interruptJobDataZip: null;
  isWorkAvailable:     boolean;
  layout:              null;
  processID:           string;
  referenceID:         string;
  saveStatus:          null;
  sessionID:           string;
}

export interface ImageInfoList {
  imageID:   number;
  index:     number;
  imagePath: string;
}
