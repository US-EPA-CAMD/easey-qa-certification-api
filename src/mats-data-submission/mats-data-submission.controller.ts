import {
  applyDecorators,
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
import { plainToInstance } from 'class-transformer';

import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionCreatePayloadDTO } from '../dto/mats-data-submission-create-payload.dto';
import { MatsDataSubmissionCreateResponseDTO } from '../dto/mats-data-submission-create-response.dto';
import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';
import { MatsDataSubmissionService } from './mats-data-submission.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';

const MAX_UPLOAD_SIZE_MB = getConfigValueNumber(
  'EASEY_QA_CERTIFICATION_API_MAX_MATS_UPLOAD_SIZE_MB',
  50,
);

const CommonRoleGuard = () =>
  applyDecorators(
    RoleGuard(
      {
        enforceCheckout: true,
        pathParam: 'locId',
        requiredRoles: ['Submitter', 'Sponsor', 'Initial Authorizer'],
        permissionsForFacility: ['DSQA'],
      },
      LookupType.Location,
    ),
  );

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Data Submission')
@ApiExcludeControllerByEnv()
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
  @CommonRoleGuard()
  @AuditLog({
    label: 'Created MATS Data Submission record',
    requestBodyOutFields: ['locationId', 'facilityId', 'monitorPlanId'],
  })
  async initializeMatsDataSubmission(
    @Body() payload: MatsDataSubmissionCreatePayloadDTO,
    @User() user: CurrentUser,
    @Param('locId') locationId: string,
  ) {
    const fileNames = payload.fileNames;
    const metadata = plainToInstance(
      MatsDataSubmissionBaseDTO,
      payload.metadata,
    );
    const warnings = await this.checksService.runChecks(
      metadata,
      fileNames,
      locationId,
    );
    const submissionId = await this.service.initializeMatsDataSubmission(
      metadata,
      fileNames,
      user.userId,
      locationId,
    );
    return {
      warnings,
      id: submissionId,
    };
  }

  @Delete(':id')
  @CommonRoleGuard()
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

  @Delete('file/:fileName')
  @ApiOkResponse({
    description:
      'Deletes a file from the MATS Data Submission record staging area',
  })
  @CommonRoleGuard()
  async deleteTempFile(
    @Param('fileName') fileName: string,
    @Param('locId') locationId: string,
  ) {
    this.service.deleteTempFile(fileName, locationId);
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
  @ApiOkResponse({
    description:
      'Uploads a file to the MATS Data Submission record staging area',
  })
  @CommonRoleGuard()
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempFile(
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
    @Param('locId') locId: string,
  ) {
    this.service.uploadTempFile(file, locId);
  }
}
