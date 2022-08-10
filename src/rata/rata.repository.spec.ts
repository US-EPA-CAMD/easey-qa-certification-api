import { Test } from '@nestjs/testing';
import { Rata } from '../entities/rata.entity';
import { SelectQueryBuilder } from 'typeorm';
import { RataRepository } from './rata.repository';

const mockQueryBuilder = () => ({});

describe('RataRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RataRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(RataRepository);
    queryBuilder = module.get<SelectQueryBuilder<Rata>>(SelectQueryBuilder);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
