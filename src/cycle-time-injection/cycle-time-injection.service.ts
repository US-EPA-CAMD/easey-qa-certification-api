import { Injectable } from '@nestjs/common';
import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { In } from 'typeorm';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { InjectRepository } from '@nestjs/typeorm';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';

@Injectable()
export class CycleTimeInjectionService {
  constructor(
    private readonly map: CycleTimeInjectionMap,
    @InjectRepository(CycleTimeInjectionRepository)
    private readonly repository: CycleTimeInjectionRepository,
  ) {}

  async getCycleTimeInjectionByCycleTimeSumIds(
    cycleTimeSumIds: string[],
  ): Promise<CycleTimeInjectionDTO[]> {
    const results = await this.repository.find({
      where: { cycleTimeSumId: In(cycleTimeSumIds) },
    });
    return this.map.many(results);
  }

  async export(cycleTimeSumIds: string[]): Promise<CycleTimeInjectionDTO[]> {
    return this.getCycleTimeInjectionByCycleTimeSumIds(cycleTimeSumIds);
  }
}
