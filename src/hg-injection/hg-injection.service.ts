import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';

import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { HgInjectionRepository } from './hg-injection.repository';

@Injectable()
export class HgInjectionService {
  constructor(
    private readonly map: HgInjectionMap,
    private readonly repository: HgInjectionRepository,
  ) {}

  async getHgInjectionsByHgTestSumId(hgTestSumId: string) {
    const records = await this.repository.find({
      where: { hgTestSumId },
    });
    return this.map.many(records);
  }

  async getHgInjection(id: string) {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(`Hg Injection record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getHgInjectionsByHgSumIds(
    hgSumIds: string[],
  ): Promise<HgInjectionDTO[]> {
    const results = await this.repository.find({
      where: { hgTestSumId: In(hgSumIds) },
    });

    return this.map.many(results);
  }

  async export(hgSumIds: string[]): Promise<HgInjectionDTO[]> {
    return await this.getHgInjectionsByHgSumIds(hgSumIds);
  }
}
