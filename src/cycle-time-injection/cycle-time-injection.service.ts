import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In, DataSource } from 'typeorm';

import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { useSlaveRepository } from '../utilities/use-slave-repository';
@Injectable()
export class CycleTimeInjectionService {
  constructor(
    private readonly map: CycleTimeInjectionMap,
    private readonly repository: CycleTimeInjectionRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getCycleTimeInjectionsByCycleTimeSumId(cycleTimeSumId: string) {

    const results = await useSlaveRepository(this.dataSource, CycleTimeInjectionRepository, async (repository) => repository.find({
      where: {
        cycleTimeSumId,
      },
    }));

    return this.map.many(results);
  }

  async getCycleTimeInjectionByCycleTimeSumIds(
    cycleTimeSumIds: string[],
  ): Promise<CycleTimeInjectionDTO[]> {
    const results = await this.repository.find({
      where: { cycleTimeSumId: In(cycleTimeSumIds) },
    });
    return this.map.many(results);
  }

  async getCycleTimeInjection(id: string) {
    const result = await useSlaveRepository(this.dataSource, CycleTimeInjectionRepository, async (repository) => repository.findOneBy({ id }));

    if (!result) {
      throw new EaseyException(
        new Error(
          `A Cycle Time Injection record not found with Record Id [${id}]`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async export(cycleTimeSumIds: string[]): Promise<CycleTimeInjectionDTO[]> {
    return this.getCycleTimeInjectionByCycleTimeSumIds(cycleTimeSumIds);
  }
}
