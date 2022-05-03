import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('Event Controller', () => {
  let controller: EventController;
  let service: EventService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [EventController],
      providers: [
        EventService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(EventController);
    service = module.get(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});