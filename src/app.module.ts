import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaperlesscvDatabaseModule } from 'src/infrastructure/persistence/paperlesscv/databaseContext/PaperlesscvDatabaseModule';
import { CqrsModule } from '@nestjs/cqrs';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ParamIdDtoValidatorCqrsService } from 'param-id-validator';
import { curriculumControllerHttp } from 'src/presentation/controllers/curriculumControllerHttp';
import { GetAllCurriculumQuery } from 'src/core/application/CQRS/curriculum/queries/GetAllQuerycurriculum';
import { DeleteCommandcurriculum } from 'src/core/application/CQRS/curriculum/commands/DeleteCommandcurriculum';
import { GetBySearchcurriculum } from 'src/core/application/CQRS/curriculum/queries/GetBySearchcurriculum';
import { CreateCommandcurriculum } from 'src/core/application/CQRS/curriculum/commands/CreateCommandcurriculum';
import { GetByIdcurriculumQuery } from 'src/core/application/CQRS/curriculum/queries/GetByIdcurriculum';
import { UpdateCommandcurriculum } from 'src/core/application/CQRS/curriculum/commands/UpdateCommandcurriculum';
import { OCRTextService } from './core/application/CQRS/curriculum/commands/CreateCommandOCRText';
import { HttpModule, HttpService } from '@nestjs/axios';
import { GetByIdOcrText } from './core/application/CQRS/curriculum/queries/GetByIdOcrText';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaperlesscvDatabaseModule,
    CqrsModule,
    HttpModule,
    ElasticsearchModule.register({
      node: new ConfigService().get<string>('elastic_search_end_point'),
    }),
  ],
  providers: [
    ParamIdDtoValidatorCqrsService,
    GetAllCurriculumQuery,
    DeleteCommandcurriculum,
    GetBySearchcurriculum,
    CreateCommandcurriculum,
    OCRTextService,
    GetByIdcurriculumQuery,
    GetByIdOcrText,
    UpdateCommandcurriculum,
  ],
  controllers: [curriculumControllerHttp],
})
export class AppModule {}
