import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './presentation/interceptors/TransformInterceptor';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

class Main {
  private app: NestFastifyApplication;

  public constructor() {
    this.bootstrap();
  }

  private async bootstrap() {
    // this.app = await NestFactory.create(AppModule);
    this.app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );

    this.setupInterceptors();
    this.setupPipes();
    this.setupSwagger();

    await this.app.listen(3003);
  }

  private setupInterceptors() {
    this.app.useGlobalInterceptors(new TransformInterceptor());
  }

  private setupPipes() {
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );
  }

  private setupSwagger() {
    const config = new DocumentBuilder()
      .setTitle('API specification')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document);
  }
}

new Main();
