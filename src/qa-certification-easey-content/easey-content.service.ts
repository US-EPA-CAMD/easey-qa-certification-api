import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QaCertificationSchema } from './qa-certification.schema.response';

@Injectable()
export class EaseyContentService {
  QaCertificationSchema: QaCertificationSchema;
  constructor(private readonly configService: ConfigService) {
    this.getQaCertificationSchema();
  }

  async getQaCertificationSchema(): Promise<void> {
    try {
      const response = await fetch(
        `${
          this.configService.get('app').contentApi.uri
        }/ecmps/reporting-instructions/qa-certification.schema.json`,
      );
      if (response.ok) this.QaCertificationSchema = await response.json();
    } catch (e) {
      console.error(e);
    }
  }
}