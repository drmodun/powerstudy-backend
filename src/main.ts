import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from 'process';
import { PostgresExceptionFilter } from './base/exceptions/postgresExceptionFilter';
import { NoValuesToSetExceptionFilter } from './base/exceptions/noValuesToSetExceptionFilter';

const setupSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('Power Study API')
    .setDescription('Api for the power study application')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(
    new PostgresExceptionFilter(),
    new NoValuesToSetExceptionFilter(),
  );

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  if (env.NODE_ENV !== 'production') setupSwagger(app);
  await app.listen(env.PORT || 3000);
}

bootstrap();
