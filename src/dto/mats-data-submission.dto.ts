import { MatsCodeDTO } from './mats-code.dto';

export class MatsDataSubmissionDTO {
  id: number;

  averagingGroup?: MatsCodeDTO;

  facilityName: string;

  frsId?: string;

  location: { id: string; name: string };

  orisCode: number;

  pollutants?: MatsCodeDTO[];

  quarter?: number;

  reportType: MatsCodeDTO;

  status: MatsCodeDTO;

  testComment?: string;

  testDate?: Date;

  testMethods?: MatsCodeDTO[];

  testNumber?: string;

  year?: number;
}
