import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationImportDTO,
  QACertificationDTO,
} from '../dto/qa-certification.dto';

import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
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
import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';
import { ReviewAndSubmitMultipleParamsMatsDTO } from '../dto/review-and-submit-multiple-params-mats.dto';
import { MatsBulkFilesReviewAndSubmitService } from './mats-bulk-files-review-and-submit.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
export class QACertificationWorkspaceController {
  constructor(
    private readonly service: QACertificationWorkspaceService,
    private readonly reviewSubmitServiceCert: CertEventReviewAndSubmitService,
    private readonly reviewSubmitServiceTestSum: TestSummaryReviewAndSubmitService,
    private readonly reviewSubmitServiceTee: TeeReviewAndSubmitService,
    private readonly reviewSubmitServiceMats: MatsBulkFilesReviewAndSubmitService,
    private readonly checksService: QACertificationChecksService,
  ) {}

  @Get('export')
  @ApiOperation({
    summary: 'Exports workspace QA Certification data',
  })
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Successfull export of workspace QA Certification data',
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
    {
      enforceCheckout: false,
      queryParam: 'facilityId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params, params.reportedValuesOnly);
  }

  @Post('import')
  @RoleGuard(
    {
      importLocationSources: [
        'testSummaryData',
        'certificationEventData',
        'testExtensionExemptionData',
      ],
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: QACertificationDTO,
    description:
      'Imports QA Certification data from JSON file into the workspace',
  })
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
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
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
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
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
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
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

  @Get('mats-bulk-file')
  @ApiOkResponse({
    isArray: true,
    type: MatsBulkFileDTO,
    description:
      'Retrieves workspace mats-bulk-files records given a list of oris codes and or mon plan ids',
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
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  async getFilteredMatsBulkFile(
    @Query() dto: ReviewAndSubmitMultipleParamsMatsDTO,
  ): Promise<MatsBulkFileDTO[]> {
    return this.reviewSubmitServiceMats.getMatsBulkFileRecords(
      dto.orisCodes,
      dto.monPlanIds,
    );
  }
}
