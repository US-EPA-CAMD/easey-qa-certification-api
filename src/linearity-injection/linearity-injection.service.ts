import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { LinearityInjectionDTO } from '../dto/linearity-injection.dto';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearityInjectionRepository } from './linearity-injection.repository';

@Injectable()
export class LinearityInjectionService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly map: LinearityInjectionMap,
    @InjectRepository(LinearityInjectionRepository)
    private readonly repository: LinearityInjectionRepository,
  ) {}

  async getLinearityInjections(linSumId: string): Promise<LinearityInjectionDTO[]> {
    const results = await this.repository.find({ linSumId });
    return this.map.many(results);
  }

  async getLinearityInjection(id: string): Promise<LinearityInjectionDTO> {
    const result = await this.repository.findOne(id);
    return this.map.one(result);
  }
}
