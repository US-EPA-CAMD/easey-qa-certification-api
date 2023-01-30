import { HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {AppEHeatInputFromOilBaseDTO, AppEHeatInputFromOilImportDTO} from "../dto/app-e-heat-input-from-oil.dto";
import {AppECorrelationTestRun} from "../entities/workspace/app-e-correlation-test-run.entity";
import {
    AppECorrelationTestRunWorkspaceRepository
} from "../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.repository";
import {AppEHeatInputFromOilWorkspaceRepository} from "./app-e-heat-input-from-oil.repository";

@Injectable()
export class AppEHeatInputFromOilChecksService {
    constructor(
        private readonly logger: Logger,
        @InjectRepository(AppECorrelationTestRunWorkspaceRepository)
        private readonly appETestRunRepo: AppECorrelationTestRunWorkspaceRepository,
        @InjectRepository(AppEHeatInputFromOilWorkspaceRepository)
        private readonly repo: AppEHeatInputFromOilWorkspaceRepository
    ) {}

    private throwIfErrors(errorList: string[]) {
        if (errorList.length > 0) {
            throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
        }
    }

    async runChecks(
        dto: AppEHeatInputFromOilBaseDTO | AppEHeatInputFromOilImportDTO,
        appEHeatInputFromOilId: string,
        appETestRunId: string,
    ): Promise<string[]> {
        let error: string = null;
        const errorList: string[] = [];

        this.logger.info('Running Appendix E Heat Input From Oil Checks');

        const appETestRun = await this.appETestRunRepo.findOneWithAncestors(appETestRunId);

        error = await this.appE50Check(appEHeatInputFromOilId, dto, appETestRun);
        if (error) {
            errorList.push(error);
        }

        this.throwIfErrors(errorList);
        this.logger.info('Completed Appendix E Heat Input From Oil Checks');
        return errorList;
    }

    async appE50Check(
        aehiOilId: string,
        dto: AppEHeatInputFromOilBaseDTO,
        appETestRun: AppECorrelationTestRun,
    ) {
        let error: string = null;
        let appETestSummary = appETestRun.appECorrelationTestSummary;
        let testSummary = appETestSummary.testSummary;

        if(dto.monitoringSystemID && appETestRun.runNumber && appETestSummary.operatingLevelForRun) {
            const duplicate = await this.repo.findDuplicate(aehiOilId, testSummary.id,
                appETestSummary.operatingLevelForRun, appETestRun.runNumber, dto.monitoringSystemID);

            if(duplicate)
                error = this.getMessage('APPE-50-A', {
                    recordtype: 'Appendix E Heat Input From Oil',
                    fieldnames: 'OperatingLevelForRun, RunNumber, MonitoringSystemID',
                });
        }

        return error;
    }
    getMessage(messageKey: string, messageArgs: object): string {
        return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
    }
}