import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { QaCertificationEventService } from './qa-certification-event.service';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification Event')
export class QaCertificationEventController {
  constructor(private readonly service: QaCertificationEventService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: QACertificationEventDTO,
    description:
      'Retrieves official QA Certification Event records by Location Id',
  })
  async getQACertEvents(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<QACertificationEventDTO>> {
    const qaCertificationEventRecordDTOS =  await this.service.getQACertEventsByLocationId(locationId);

    return  {
      items: qaCertificationEventRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: QACertificationEventDTO,
    description: 'Retrieves QA Certification Event record by its Id',
  })
  getQACertEvent(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
  ): Promise<QACertificationEventDTO> {
    return this.service.getQACertEvent(id);
  }
}
