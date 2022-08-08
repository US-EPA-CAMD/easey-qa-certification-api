import { Test, TestingModule } from '@nestjs/testing';
import { RataMap } from '../maps/rata.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataWorkspaceService } from './rata-workspace.service';

const mockRepository = () => ({});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue({}),
  many: jest.fn().mockResolvedValue([{}]),
});

describe('RataWorkspaceService', () => {
  let service: RataWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataWorkspaceService>(RataWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
