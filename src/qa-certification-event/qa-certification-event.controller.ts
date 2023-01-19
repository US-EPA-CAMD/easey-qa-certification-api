import { Controller, Get, Param } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { QaCertificationEventService } from './qa-certification-event.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification Event')
export class QaCertificationEventController {
  constructor(private readonly service: QaCertificationEventService) {}

  @Get(':id')
  getQACertEvent(@Param('locId') _locId: string, @Param('id') id: string) {
    return this.service.getQACertEvent(id);
  }
}
