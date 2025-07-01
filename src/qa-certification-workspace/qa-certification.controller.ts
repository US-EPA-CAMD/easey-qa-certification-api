import { Get, Body, Post, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiQuery,
  ApiOperation, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import {
  AuditLog,
  RoleGuard,
  User,
} from '@us-epa-camd/easey-common/decorators';
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
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
@ApiExcludeControllerByEnv()
@ApiExtraModels(CertEventReviewAndSubmitDTO)
@ApiExtraModels(ReviewAndSubmitTestSummaryDTO)
@ApiExtraModels(TeeReviewAndSubmitDTO)
export class QACertificationWorkspaceController {
  constructor(
    private readonly service: QACertificationWorkspaceService,
    private readonly reviewSubmitServiceCert: CertEventReviewAndSubmitService,
    private readonly reviewSubmitServiceTestSum: TestSummaryReviewAndSubmitService,
    private readonly reviewSubmitServiceTee: TeeReviewAndSubmitService,
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
  @AuditLog({
    label: 'Exported workspace QA Certification records',
    requestQueryOutFields: '*',
  })
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
  @AuditLog({
    label: 'Imported workspace QA Certification records',
    requestBodyOutFields: ['orisCode', 'testSummaryData.testNumber'],
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
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  @AuditLog({
    label: 'Retrieved workspace certification event records',
    requestQueryOutFields: ['orisCodes', 'monPlanIds', 'quarters'],
  })
  async getFilteredCerts(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<CertEventReviewAndSubmitDTO>> {
    const certEventRecords =
      await this.reviewSubmitServiceCert.getCertEventRecords(
        dto.orisCodes,
        dto.monPlanIds,
        dto.quarters,
      );
    return { items: certEventRecords };
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
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  @AuditLog({
    label: 'Retrieved workspace test summary records',
    requestQueryOutFields: ['orisCodes', 'monPlanIds', 'quarters'],
  })
  async getFilteredTestSums(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<ReviewAndSubmitTestSummaryDTO>> {
    const testSummaryRecords =
      await this.reviewSubmitServiceTestSum.getTestSummaryRecords(
        dto.orisCodes,
        dto.monPlanIds,
        dto.quarters,
      );
    return { items: testSummaryRecords };
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
  @RoleGuard(
    {
      enforceCheckout: false,
      queryParam: 'orisCodes',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.Facility,
  )
  @AuditLog({
    label: 'Retrieved test extension exemption records',
    requestQueryOutFields: ['orisCodes', 'monPlanIds', 'quarters'],
  })
  async getFilteredTee(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ArrayResponse<TeeReviewAndSubmitDTO>> {
    const teeRecords = await this.reviewSubmitServiceTee.getTeeRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
    );
    return { items: teeRecords };
  }
}
