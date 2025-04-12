import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
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
import { plainToClass } from 'class-transformer';

import { MatsDataSubmissionCreateResponseDTO } from '../dto/mats-data-submission-create-response.dto';
import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
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
  async initializeMatsDataSubmission(
    @Body('metadata') rawMetadata: string,
    @UploadedFiles()
    files: {
      ertFile?: Express.Multer.File[];
      payloadFile?: Express.Multer.File[];
      supportingFiles?: Express.Multer.File[];
    },
    @User() user: CurrentUser,
  ) {
    const metadata: MatsDataSubmissionBaseDTO = plainToClass(
      MatsDataSubmissionBaseDTO,
      JSON.parse(rawMetadata),
    );
    // Only accept one file for ertFile and payloadFile, but allow multiple for supportingFiles.
    const relevantFiles = {
      ertFile: files.ertFile?.[0],
      payloadFile: files.payloadFile?.[0],
      supportingFiles: files.supportingFiles,
    };
    const warnings = await this.checksService.runChecks(
      metadata,
      relevantFiles,
    );
    const submissionId = await this.service.initializeMatsDataSubmission(
      metadata,
      relevantFiles,
      user.userId,
    );
    return {
      warnings,
      id: submissionId,
    };
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description:
      'Deletes a MATS Data Submission record and all associated files.',
  })
  @AuditLog({
    label: 'Deleted MATS Data Submission record',
    requestParamsOutFields: ['id', 'locId'],
  })
  async deleteMatsDataSubmission(@Param('id', ParseIntPipe) id: number) {
    this.service.deleteMatsDataSubmission(id);
  }
}
