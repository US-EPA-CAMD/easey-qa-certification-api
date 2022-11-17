import { Test, TestingModule } from '@nestjs/testing';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewAndSubmitController } from './review-and-submit.controller';
import { ReviewAndSubmitService } from './review-and-submit.service';

const mockService = () => ({
  getTestSummary: jest.fn(),
});

describe('ReviewAndSubmitController', () => {
  let controller: ReviewAndSubmitController;
  let service: ReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ReviewAndSubmitController],
      providers: [{ provide: ReviewAndSubmitService, useFactory: mockService }],
    }).compile();

    controller = module.get<ReviewAndSubmitController>(
      ReviewAndSubmitController,
    );
    service = module.get<ReviewAndSubmitService>(ReviewAndSubmitService);
  });

  describe('getTestSummary', () => {
    it('should call the review and submit test summary controller function and return a list of dtos', async () => {
      const dto = new ReviewAndSubmitTestSummaryDTO();
      service.getTestSummaryRecords = jest.fn().mockResolvedValue([dto]);

      const result = await controller.getTestSummary(
        new ReviewAndSubmitMultipleParamsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });
});
