import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { EventDTO } from '../dto/event.dto';
import { EventService } from './event.service';

@Controller()
@ApiTags('Events')
@ApiSecurity('APIKey')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves the official qa certification events',
  })
  getEvents(): Promise<EventDTO> {
    return this.service.getEvents();
  }
}
