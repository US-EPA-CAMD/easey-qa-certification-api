export class MatsDataSubmissionDTO {
  id: number;

  averagingGroup?: string;

  facilityName: string;

  frsId?: string;

  location: string;

  orisCode: number;

  pollutants?: string[];

  quarter?: number;

  reportType: string;

  status: string;

  testComment?: string;

  testDate?: Date;

  testMethods?: string[];

  testNumber?: string;

  year?: number;
}
