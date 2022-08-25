import * as helmet from "helmet";
import { json } from "body-parser";
import { ConfigService } from "@nestjs/config";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { Logger } from "@us-epa-camd/easey-common/logger";
import { LoggingInterceptor } from "@us-epa-camd/easey-common/interceptors";
import { CorsOptionsService } from "@us-epa-camd/easey-common/cors-options";

export async function applyMiddleware(
  app: INestApplication,
  allowCredentials: boolean = false,
) {
  const configService = app.get(ConfigService);
  const corsOptionsService = app.get(CorsOptionsService);

  const appName = configService.get<string>("app.name");
  const appPath = configService.get<string>("app.path");
  const reqSizeLimit = configService.get<string>("app.reqSizeLimit");

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          blockAllMixedContent: [],
          fontSrc: ["'self'", "https:", "data:"],
          frameAncestors: ["'self'"],
          imgSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'"],
          scriptSrcAttr: ["'none'"],
          styleSrc: ["'self'", "https:", "'unsafe-inline'"],
          upgradeInsecureRequests: [],
          connectSrc: ["'self'", "api.epa.gov"],
        },
      },
    })
  );

  app.setGlobalPrefix(appPath);
  app.use(json({ limit: reqSizeLimit }));
  app.useGlobalInterceptors(new LoggingInterceptor(new Logger()));

  if (configService.get<boolean>("app.enableGlobalValidationPipes")) {
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }

  if (configService.get<boolean>("app.enableCors")) {
    app.enableCors(async (req, callback) => {
      await corsOptionsService.configure(
        req,
        appName,
        callback,
        allowCredentials,
        configService.get<string>("app.env")
      );
    });
  }
}

export default applyMiddleware;