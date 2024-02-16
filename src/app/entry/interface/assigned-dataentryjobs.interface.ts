export interface AssignedDataentryJobs {
  jobs:    Job[];
  layouts: Layout[];
}

export interface Job {
  projectName:    string;
  documentCount:  number;
  zOrder:         number;
  processName:    string;
  currentVersion: string;
  layoutName:     string;
}

export interface Layout {
  layoutName: string;
  layout:     string;
}
