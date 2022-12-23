import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { HgInjectionRepository } from './hg-injection.repository';

@Injectable()
export class HgInjectionService {
  constructor(
    private readonly map: HgInjectionMap,
    @InjectRepository(HgInjectionRepository)
    private readonly repository: HgInjectionRepository,
  ) {}

  async getHgInjections(hgTestSumId: string): Promise<HgInjectionDTO[]> {
    const records = await this.repository.find({ where: { hgTestSumId } });

    return this.map.many(records);
  }

  async getHgInjection(
    id: string,
    hgTestSumId: string,
  ): Promise<HgInjectionDTO> {
    const result = await this.repository.findOne({
      id,
      hgTestSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Hg Injection record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}
