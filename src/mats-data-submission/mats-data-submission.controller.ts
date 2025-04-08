import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuditLog,
  RoleGuard,
  User,
} from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';
import { plainToClass } from 'class-transformer';

import {
  MatsDataSubmissionDTO,
  MatsDataSubmissionBaseDTO,
} from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionCreateResponseDTO } from '../dto/mats-data-submission-create-response.dto';
import { SplitQueryPipe } from '../pipes/split-query.pipe';
import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Data Submission')
export class MatsDataSubmissionController {
  constructor(
    private readonly checksService: MatsDataSubmissionChecksService,
    private readonly service: MatsDataSubmissionService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MatsDataSubmissionDTO,
    description:
      'Retrieves MATS Data Submission records for a given Monitoring Plan ID',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: true,
    explode: false,
  })
  @RoleGuard(
    {
      queryParam: 'monPlanIds',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Retrieved MATS Data Submission records',
    requestQueryOutFields: ['monPlanIds'],
  })
  async getMatsDataSubmissions(
    @Query('monPlanIds', SplitQueryPipe) monPlanIds: string[],
  ): Promise<ArrayResponse<MatsDataSubmissionDTO>> {
    const submissions = await this.service.getMatsDataSubmissions(monPlanIds);

    return {
      items: submissions,
    };
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: MatsDataSubmissionCreateResponseDTO,
    description: 'Creates a MATS Data Submission record',
  })
  @ApiBody({
    description: 'Multiple files and submission metadata to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        metadata: {
          type: 'string',
          description: 'JSON string of a MatsDataSubmissionBaseDTO object',
        },
        ertFile: {
          type: 'string',
          format: 'binary',
        },
        payloadFile: {
          type: 'string',
          format: 'binary',
        },
        supportingFiles: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  // FIXME: Properly parse metadata before validation.
  /*@RoleGuard(
    {
      bodyParam: 'metadata.monitorPlanId',
      requiredRoles: ['Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.MonitorPlan,
  )*/
  @AuditLog({
    label: 'Created MATS Data Submission record',
    requestBodyOutFields: ['locationId', 'facilityId', 'monitorPlanId'],
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'ertFile', maxCount: 1 },
      { name: 'payloadFile', maxCount: 1 },
      { name: 'supportingFiles' },
    ]),
  )
  async createMatsDataSubmission(
    @Body('metadata') rawMetadata: string,
    @UploadedFiles()
    files: {
      ertFile?: Express.Multer.File[];
      payloadFile?: Express.Multer.File[];
      supportingFiles?: Express.Multer.File[];
    },
    @User() user: CurrentUser,
    @Query('draft') draft: boolean,
  ) {
    const metadata: MatsDataSubmissionBaseDTO = plainToClass(
      MatsDataSubmissionBaseDTO,
      JSON.parse(rawMetadata),
    );
    const ertFile = files.ertFile?.[0];
    const payloadFile = files.payloadFile?.[0];
    const supportingFiles = files.supportingFiles;

    console.log('metadata', metadata);
    console.log('ertFile', ertFile?.size);
    console.log('payloadFile', payloadFile?.size);
    console.log('supportingFiles', supportingFiles?.length);

    const warnings = await this.checksService.runChecks(metadata, files);
    if (draft) {
      return { warnings, id: null };
    }
    const submissionId = await this.service.createMatsDataSubmission(
      metadata,
      files,
      user.userId,
    );
    return {
      warnings,
      id: submissionId,
    };
  }
}
