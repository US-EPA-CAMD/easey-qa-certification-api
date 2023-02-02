import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AppECorrelationTestSummaryChecksService } from './app-e-correlation-test-summary-checks.service';
import {
    AppECorrelationTestSummaryBaseDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { AppendixETestSummaryWorkspaceRepository} from "../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.repository";

const MOCK_ERROR_MSG = 'ERROR MSG';
const mockAppETestSummary = new AppECorrelationTestSummary();
mockAppETestSummary.operatingLevelForRun = 1;
const mockAppETestRun = new AppECorrelationTestRun();
const mockDTO = new AppECorrelationTestSummaryBaseDTO();
mockDTO.operatingLevelForRun = 1;
const testSumId = '1';

const mockRepo = () => ({
    findDuplicate: jest.fn(),
});

describe('Appendix E Correlation Test Summary Checks Service Test', () => {
    let service: AppECorrelationTestSummaryChecksService;
    let repo: AppendixETestSummaryWorkspaceRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [LoggerModule, LoggingException],
            providers: [
                AppECorrelationTestSummaryChecksService,
                {
                    provide: AppendixETestSummaryWorkspaceRepository,
                    useFactory: mockRepo,
                },
            ],
        }).compile();

        service = module.get(AppECorrelationTestSummaryChecksService);
        jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

        repo = module.get<
            AppendixETestSummaryWorkspaceRepository
        >(AppendixETestSummaryWorkspaceRepository);
    });

    describe('Appendix E Correlation Test Summary Checks', () => {
        it('Should pass APPE-48 Check when no duplicates', async () => {
            const result = await service.runChecks(mockDTO, null, testSumId);
            expect(result).toEqual([]);
        });

        it('Should fail APPE-48 check when there is a duplicate', async () => {
            jest
                .spyOn(repo, 'findDuplicate')
                .mockResolvedValue(mockAppETestSummary);

            let result;
            try {
                result = await service.runChecks(mockDTO, null, testSumId);
            } catch (err) {
                result = err.response.message;
            }

            expect(result).toEqual([MOCK_ERROR_MSG]);
        });
    });
});