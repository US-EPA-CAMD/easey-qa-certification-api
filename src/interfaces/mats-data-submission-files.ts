export interface MatsDataSubmissionFiles {
  ertFile?: Express.Multer.File;
  payloadFile?: Express.Multer.File;
  supportingFiles?: Express.Multer.File[];
}
