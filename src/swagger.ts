import { ConfigService } from "@nestjs/config";
import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export async function applySwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const appTitle = configService.get<string>("app.title");
  const appPath = configService.get<string>("app.path");
  const appEnv = configService.get<string>("app.env");
  const appHost = configService.get<string>("app.host");
  const apiHost = configService.get<string>("app.apiHost");
  const appVersion = configService.get<string>("app.version");
  const appPublished = configService.get<string>("app.published");

  let appDesc = `EPA ${appEnv} Environment: The content on this page is not production data and used for <strong>development</strong> and/or <strong>testing</strong> purposes only.`;

  let swaggerCustomOptions = {
    customCss: ".description .renderedMarkdown p { color: #FC0; padding: 10px; background: linear-gradient(to bottom,#520001 0%,#6c0810 100%); }"
  };
 
  if (configService.get<string>("app.description")) {
    if (appEnv != "production") {
      appDesc = `${appDesc} <br> <br> ${configService.get<string>("app.description")}`;
    } else {
      appDesc = configService.get<string>("app.description");
      swaggerCustomOptions = {
        customCss:
          ".description .renderedMarkdown p { color: #000000; padding: 10px; background: linear-gradient(to bottom,#B2BEB5 0%,#A9A9A9 100%); }",
      };
    }
  }

  const swaggerDocOptions = new DocumentBuilder()
    .setTitle(`${appTitle} OpenAPI Specification`)
    .setDescription(appDesc)
    .setVersion(`${appVersion} published: ${appPublished}`);

  if (configService.get<boolean>("app.enableApiKey")) {
    swaggerDocOptions.addApiKey(
      {
        in: "header",
        type: "apiKey",
        name: "x-api-key",
        description: 'API Key required via "x-api-key" request header!',
      },
      "APIKey"
    );
  }

  if (configService.get<boolean>("app.enableAuthToken")) {
    swaggerDocOptions.addBearerAuth(
      {
        in: "header",
        type: "http",
        scheme: "bearer",
        name: "Token",
        description:
          'Authorization "bearer" token required for data modification operations',
      },
      "Token"
    );
  }

  if (configService.get<boolean>("app.enableClientToken")) {
    swaggerDocOptions.addBearerAuth(
      {
        in: "header",
        type: "http",
        scheme: "bearer",
        bearerFormat: "jwt",
        name: "ClientToken",
        description:
          'Authorization "bearer" client jwt token required for api endpoints',
      },
      "ClientToken"
    );

    swaggerDocOptions.addApiKey(
      {
        in: "header",
        type: "apiKey",
        name: "x-client-id",
        description: 'ClientId required via "x-client-id" request header',
      },
      "ClientId"
    );
  }

  if (appHost !== "localhost") {
    swaggerDocOptions.addServer(`https://${apiHost}`);
  }

  const document = SwaggerModule.createDocument(app, swaggerDocOptions.build());
  SwaggerModule.setup(
    `${appPath}/swagger`,
    app,
    document,
    swaggerCustomOptions
  );
}

export default applySwagger;