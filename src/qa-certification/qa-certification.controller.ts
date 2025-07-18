import { Get, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiQuery,
  ApiOperation, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';
import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { CertEventReviewAndSubmitService } from '../qa-certification-workspace/cert-event-review-and-submit.service';
import { TestSummaryReviewAndSubmitService } from '../qa-certification-workspace/test-summary-review-and-submit.service';
import { TeeReviewAndSubmitService } from '../qa-certification-workspace/tee-review-and-submit.service';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
@ApiExtraModels(CertEventReviewAndSubmitDTO)
@ApiExtraModels(ReviewAndSubmitTestSummaryDTO)
@ApiExtraModels(TeeReviewAndSubmitDTO)
export class QACertificationController {
  constructor(
    private readonly service: QACertificationService,
    private readonly reviewSubmitServiceCert: CertEventReviewAndSubmitService,
    private readonly reviewSubmitServiceTestSum: TestSummaryReviewAndSubmitService,
    private readonly reviewSubmitServiceTee: TeeReviewAndSubmitService,
  ) {}

  @Get('export')
  @ApiOperation({
    summary: 'Exports official QA Certification data',
  })
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Successfull export of official QA Certification data',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'unitIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'stackPipeIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testSummaryIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testTypeCodes',
    required: false,
    explode: false,
  })
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params, params.reportedValuesOnly);
  }

  @Get('cert-events')
  @ApiOkResponse({
    description:
      'Retrieves workspace test summary records given a list of oris codes and or mon plan ids',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(CertEventReviewAndSubmitDTO) },
              },
            },
          },
        },
      }
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'quarters',
    required: false,
    explode: false,
  })
  async getFilteredCerts(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<CertEventReviewAndSubmitDTO>> {
    const certEventReviewAndSubmitDTOS =  await  this.reviewSubmitServiceCert.getCertEventRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
      false,
    );

    return  {
      items: certEventReviewAndSubmitDTOS
    };
  }

  @Get('test-summary')
  @ApiOkResponse({
    description:
      'Retrieves workspace test summary records given a list of oris codes and or mon plan ids',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(ReviewAndSubmitTestSummaryDTO) },
              },
            },
          },
        },
      }
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'quarters',
    required: false,
    explode: false,
  })
  async getFilteredTestSums(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<ReviewAndSubmitTestSummaryDTO>> {
    const testSummaryDTOS =  await  this.reviewSubmitServiceTestSum.getTestSummaryRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
      false,
    );

    return  {
      items: testSummaryDTOS
    };
  }

  @Get('test-extension-exemption')
  @ApiOkResponse({
    description:
      'Retrieves workspace tee records given a list of oris codes and or mon plan ids',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(TeeReviewAndSubmitDTO) },
              },
            },
          },
        },
      }
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'quarters',
    required: false,
    explode: false,
  })
  async getFilteredTee(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<TeeReviewAndSubmitDTO>> {
    const teeRecords =  await this.reviewSubmitServiceTee.getTeeRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
      false,
    );

    return  {
      items: teeRecords
    };
  }
}
