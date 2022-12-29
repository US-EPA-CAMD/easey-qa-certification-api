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

  async getHgInjectionsByHgTestSumId(
    hgTestSumId: string,
  ): Promise<HgInjectionDTO[]> {
    const results = await this.repository.find({ hgTestSumId });
    return this.map.many(results);
  }

  async getHgInjection(id: string): Promise<HgInjectionDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Hg Injection record not found with Record Id [${id}].`,
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
