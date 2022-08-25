import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AppModule } from './app.module';
import { applySwagger } from './swagger';
import { applyMiddleware } from './middleware';
import { CacheService } from './cache/cache.service';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPath = configService.get<string>("app.path");

  CacheService.load();
  applyMiddleware(app);
  applySwagger(app);

  const server = await app.listen(configService.get<number>("app.port"));
  server.setTimeout(1800000);

  console.log(
    `Application is running on: ${await app.getUrl()}/${appPath}/swagger`
  );
}

bootstrap();
