import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

import {
  MatsDataSubmissionBaseDTO,
  MatsDataSubmissionDTO,
} from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionFiles } from '../interfaces/mats-data-submission-files';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';

@Injectable()
export class MatsDataSubmissionService {
  constructor(
    private readonly map: MatsDataSubmissionMap,
    private readonly repository: MatsDataSubmissionRepository,
  ) {}

  async createMatsDataSubmission(
    metadata: MatsDataSubmissionBaseDTO,
    files: MatsDataSubmissionFiles,
    userId: string,
    //): Promise<number> {
  ) {
    // TODO: Create the MATS Data Submission record along with necessary MATS_DATA_SUBMISSION_POLLUTANT & MATS_DATA_SUBMISSION_TEST_METHOD records.
    // TODO: Generate the Metadata XML file.
    // TODO: Upload the files to S3 and create MATS_DATA_SUBMISSION_PAYLOAD_FILE records.
  }
}
