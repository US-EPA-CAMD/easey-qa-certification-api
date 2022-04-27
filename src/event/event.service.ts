import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EventDTO } from '../dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    //private readonly map: EventMap,
    //private readonly repository: EventRepository,
    private readonly configService: ConfigService,
  ) {}

  async getEvents(): Promise<EventDTO> {
    return new EventDTO[0];
  }
}
