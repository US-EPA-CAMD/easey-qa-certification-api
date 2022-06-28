import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { TestSummaryRepository } from './test-summary.repository';

const mockQueryBuilder = () => ({
    getOne: jest.fn(),
    getMany: jest.fn(),
    innerJoinAndSelect: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    leftJoin: jest.fn(),
    andWhere: jest.fn(),
    where: jest.fn(),
});

describe('Test Summary Repository Test', () => {
    let repository: TestSummaryRepository;
    let queryBuilder: any;

    beforeEach(async()=>{
        const module = await Test.createTestingModule({
            providers: [
                TestSummaryRepository,
              {
                provide: SelectQueryBuilder,
                useFactory: mockQueryBuilder,
              },
            ],
          }).compile();
        
        repository = module.get(TestSummaryRepository);
        queryBuilder = module.get(SelectQueryBuilder);

        queryBuilder.getOne.mockResolvedValue("mockstring");
        queryBuilder.getMany.mockResolvedValue([]);

        queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
        queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
        queryBuilder.leftJoin.mockReturnValue(queryBuilder);
        queryBuilder.andWhere.mockReturnValue(queryBuilder);
        queryBuilder.where.mockReturnValue(queryBuilder);

        repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    })

    describe('getTestSummaryById Test', ()=>{
        it('successfully calls getTestSummaryById()', async ()=>{
            const result = await repository.getTestSummaryById("");
            expect(result).toEqual("mockstring");
        })
    })

    describe('getTestSummaryByLocationId Test', ()=>{
        it('successfully calls getTestSummaryByLocationId()', async ()=>{
            const result = await repository.getTestSummaryByLocationId("");
            expect(result).toEqual("mockstring");
        })
    })

    describe('getTestSummariesByLocationId Test', ()=>{
        it('successfully calls getTestSummariesByLocationId()', async ()=>{
            const result = await repository.getTestSummariesByLocationId("");
            expect(result).toEqual([]);
        })
    })

    describe('getTestSummariesByUnitStack Test', ()=>{
        it('successfully calls getTestSummariesByUnitStack()', async ()=>{
            const result = await repository.getTestSummariesByUnitStack(3);
            expect(result).toEqual([]);
        })
    })



})
