import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { getConfigValueNumber } from '@us-epa-camd/easey-common/utilities';

import { MatsDataSubmissionCreatePayloadDTO } from '../dto/mats-data-submission-create-payload.dto';
import { MatsDataSubmissionCreateResponseDTO } from '../dto/mats-data-submission-create-response.dto';
import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';
import { MatsDataSubmissionService } from './mats-data-submission.service';

const MAX_UPLOAD_SIZE_MB = getConfigValueNumber(
  'EASEY_QA_CERTIFICATION_API_MAX_MATS_UPLOAD_SIZE_MB',
  50,
);

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Data Submission')
export class MatsDataSubmissionController {
  constructor(
    private readonly checksService: MatsDataSubmissionChecksService,
    private readonly service: MatsDataSubmissionService,
  ) {}

  @Post()
  @ApiOkResponse({
    type: MatsDataSubmissionCreateResponseDTO,
    description: 'Creates a MATS Data Submission record',
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
  async initializeMatsDataSubmission(
    @Body() payload: MatsDataSubmissionCreatePayloadDTO,
    @User() user: CurrentUser,
  ) {
    const { metadata, filePaths } = payload;
    const warnings = await this.checksService.runChecks(metadata, filePaths);
    const submissionId = await this.service.initializeMatsDataSubmission(
      metadata,
      filePaths,
      user.userId,
    );
    return {
      warnings,
      id: submissionId,
    };
  }

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: new RegExp(
              /^(application\/pdf|application\/xml|text\/xml|application\/json|text\/json)$/,
            ),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ filePath: string }> {
    const filePath = await this.service.importFile(file);
    return { filePath };
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
  async deleteMatsDataSubmission(@Param('id') id: string) {
    this.service.deleteMatsDataSubmission(id);
  }
}
