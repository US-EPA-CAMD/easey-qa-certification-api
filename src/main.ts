import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  applySwagger,
  applyMiddleware,
} from '@us-epa-camd/easey-common/nestjs';

import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  CheckCatalogService.load(
    'camdecmpsmd.vw_qa_certification_api_check_catalog_results',
  );

  applyMiddleware(AppModule, app);
  applySwagger(app);

  const configService = app.get(ConfigService);
  const appPath = configService.get<string>('app.path');
  const appPort = configService.get<number>('app.port');

  const server = await app.listen(appPort);
  server.setTimeout(1800000);

  console.log(
    `Application is running on: ${await app.getUrl()}/${appPath}/swagger`,
  );
}

bootstrap();
