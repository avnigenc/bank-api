import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { Logger } from 'nestjs-pino';
import { author, description, name, version } from '../package.json';
import { AppModule } from './app.module';
import { Version } from './common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: () => crypto.randomUUID().toString(),
      disableRequestLogging: true,
    }),
  );

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get('PORT');
  const logger = app.get(Logger);
  app.useLogger(logger);

  configure(app);
  configureSwagger(app);

  await app.listen(port, () => {
    logger.log(`[NOD] ${process.version}`);
    logger.log(`[ENV] ${process.env.NODE_ENV}`);
    logger.log(`[DKR] ${!!process.env.IS_DOCKER}`);
    logger.log(`[URL] http://localhost:${port}`);
  });
}

function configure(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: Version.One,
  });
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .setContact(author.name, '', author.email)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);
}

bootstrap().catch(console.log);
