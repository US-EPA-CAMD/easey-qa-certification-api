import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { In, DataSource } from 'typeorm';

import { LinearityInjectionDTO } from '../dto/linearity-injection.dto';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearityInjectionRepository } from './linearity-injection.repository';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';
@Injectable()
export class LinearityInjectionService {
  constructor(
    private readonly logger: Logger,
    private readonly map: LinearityInjectionMap,
    private readonly repository: LinearityInjectionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getInjectionById(id: string): Promise<LinearityInjectionDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `A linearity injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getInjectionsByLinSumId(
    linSumId: string,
  ): Promise<LinearityInjectionDTO[]> {
    const results = await useSlaveRepository(this.dataSource, LinearityInjectionRepository, async (repository) => repository.findBy({ linSumId }));
    return this.map.many(results);
  }

  async getInjectionsByLinSumIds(
    linSumIds: string[],
  ): Promise<LinearityInjectionDTO[]> {
    const results = await this.repository.find({
      where: { linSumId: In(linSumIds) },
    });
    return this.map.many(results);
  }

  async export(linSumIds: string[]): Promise<LinearityInjectionDTO[]> {
    return this.getInjectionsByLinSumIds(linSumIds);
  }
}
