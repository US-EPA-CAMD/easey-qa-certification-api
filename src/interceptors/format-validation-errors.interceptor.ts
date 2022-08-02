import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FormatValidationErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        const regex = /((test|linearity|cycleTime|appECorrelationTest|Hg)Summary|certificationEvent|testExtensionExemption|calibrationInjection|rata|flowToLoad(Reference|Check)|onlineOfflineCalibration|fuelFlowmeterAccuracy|transmitterTransducer|fuelFlowToLoad(Baseline|Test)|testQualification|protocolGas|(unitDefault|airEmission)Test)Data.\d./;
        //const regex = /(testSummary|certificationEvent|testExtensionExemption|calibrationInjection|linearitySummary|rata|flowToLoadReference|flowToLoadCheck|cycleTimeSummary|onlineOfflineCalibration|fuelFlowmeterAccuracy|transmitterTransducer|fuelFlowToLoadBaseline|fuelFlowToLoadTest|appECorrelationTestSummary|unitDefaultTest|hgSummary|testQualification|protocolGas|airEmissionTest)Data.\d./;
        console.log(err);
        if (
          err.response &&
          err.response.statusCode &&
          err.response.statusCode === 400 &&
          (err.response.message as string[]) &&
          err.response.message.length > 0
        ) {
          err.response.message = err.response.message.map((e: string) =>
            e.replace(regex, ''),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
