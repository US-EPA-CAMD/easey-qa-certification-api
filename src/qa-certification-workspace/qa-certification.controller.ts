import {
  Get,
  Body,
  Post,
  Query,
  Controller,
  UseInterceptors,
} from '@nestjs/common';

import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationImportDTO,
  QACertificationDTO,
} from '../dto/qa-certification.dto';

import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { FormatValidationErrorsInterceptor } from '../interceptors/format-validation-errors.interceptor';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { CertEventReviewAndSubmitService } from './cert-event-review-and-submit.service';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { TestSummaryReviewAndSubmitService } from './test-summary-review-and-submit.service';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { TeeReviewAndSubmitService } from './tee-review-and-submit.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
export class QACertificationWorkspaceController {
  constructor(
    private readonly service: QACertificationWorkspaceService,
    private readonly reviewSubmitServiceCert: CertEventReviewAndSubmitService,
    private readonly reviewSubmitServiceTestSum: TestSummaryReviewAndSubmitService,
    private readonly reviewSubmitServiceTee: TeeReviewAndSubmitService,
    private readonly checksService: QACertificationChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Exports worksapce QA Certification data',
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
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'facilityId' },
    LookupType.Facility,
  )
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params);
  }

  @Post('import')
  @RoleGuard(
    {
      importLocationSources: [
        'testSummaryData',
        'certificationEventData',
        'testExtensionExemptionData',
      ],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: QACertificationDTO,
    description:
      'Imports QA Certification data from JSON file into the workspace',
  })
  @UseInterceptors(FormatValidationErrorsInterceptor)
  async import(
    @Body() payload: QACertificationImportDTO,
    @User() user: CurrentUser,
  ) {
    let qaSuppRecords: QASuppData[] = [];
    let locations: LocationIdentifiers[] = [];

    [locations, qaSuppRecords] = await this.checksService.runChecks(payload);
    return this.service.import(locations, payload, user.userId, qaSuppRecords);
  }

  @Get('cert-events')
  @ApiOkResponse({
    isArray: true,
    type: CertEventReviewAndSubmitDTO,
    description:
      'Retrieves workspace test summary records given a list of oris codes and or mon plan ids',
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
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'orisCodes', isPipeDelimitted: true },
    LookupType.Facility,
  )
  async getFilteredCerts(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<CertEventReviewAndSubmitDTO[]> {
    return this.reviewSubmitServiceCert.getCertEventRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
    );
  }

  @Get('test-summary')
  @ApiOkResponse({
    isArray: true,
    type: ReviewAndSubmitTestSummaryDTO,
    description:
      'Retrieves workspace test summary records given a list of oris codes and or mon plan ids',
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
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'orisCodes', isPipeDelimitted: true },
    LookupType.Facility,
  )
  async getFilteredTestSums(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {
    return this.reviewSubmitServiceTestSum.getTestSummaryRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
    );
  }

  @Get('test-extension-exemption')
  @ApiOkResponse({
    isArray: true,
    type: TeeReviewAndSubmitDTO,
    description:
      'Retrieves workspace tee records given a list of oris codes and or mon plan ids',
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
  @RoleGuard(
    { enforceCheckout: false, queryParam: 'orisCodes', isPipeDelimitted: true },
    LookupType.Facility,
  )
  async getFilteredTee(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<TeeReviewAndSubmitDTO[]> {
    return this.reviewSubmitServiceTee.getTeeRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
    );
  }
}
