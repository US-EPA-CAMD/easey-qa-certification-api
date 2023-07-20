import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';

@Injectable()
export class CycleTimeInjectionService {
  constructor(
    private readonly map: CycleTimeInjectionMap,
    @InjectRepository(CycleTimeInjectionRepository)
    private readonly repository: CycleTimeInjectionRepository,
  ) {}

  async getCycleTimeInjectionsByCycleTimeSumId(cycleTimeSumId: string) {
    const results = await this.repository.find({
      where: {
        cycleTimeSumId,
      },
    });

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
    const result = await this.repository.findOne(id);

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
