import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { HgInjectionMap } from '../maps/hg-injection.map';
import { HgInjectionRepository } from './hg-injection.repository';
import { HgInjectionDTO } from '../dto/hg-injection.dto';

@Injectable()
export class HgInjectionService {
  constructor(
    private readonly map: HgInjectionMap,
    @InjectRepository(HgInjectionRepository)
    private readonly repository: HgInjectionRepository,
  ) {}

  async getHgInjectionsByHgTestSumId(hgTestSumId: string) {
    const records = await this.repository.find({
      where: { hgTestSumId },
    });
    return this.map.many(records);
  }

  async getHgInjection(id: string) {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Hg Injection record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getHgInjectionsByHgTestSumIds(
    hgTestSumIds: string[],
  ): Promise<HgInjectionDTO[]> {
    const results = await this.repository.find({
      where: { hgTestSumId: In(hgTestSumIds) },
    });

    return this.map.many(results);
  }

  async export(hgTestSumIds: string[]): Promise<HgInjectionDTO[]> {
    return await this.getHgInjectionsByHgTestSumIds(hgTestSumIds);
  }
}
