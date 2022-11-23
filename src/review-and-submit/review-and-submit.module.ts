import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { ReviewAndSubmitTestSummaryRepository } from './review-and-submit-test-summary.repository';
import { ReviewAndSubmitController } from './review-and-submit.controller';
import { ReviewAndSubmitService } from './review-and-submit.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewAndSubmitTestSummaryRepository])],
  controllers: [ReviewAndSubmitController],
  providers: [ReviewAndSubmitService, ReviewAndSubmitTestSummaryMap],
})
export class ReviewAndSubmitModule {}
