import { ConfigService } from '@nestjs/config';
import { ICommandHandler } from '@nestjs/cqrs';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';

import { CreateOcrTextDto } from '../../../DTO/http/curriculum/CreateOcrTextDto';
import { OcrText } from 'src/infrastructure/persistence/paperlesscv/configuration/OcrText';
import { lastValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { StructuredDataDto } from 'src/core/application/DTO/inner/StructuredDataDto';

export class OCRTextService implements ICommandHandler<CreateOcrTextDto> {
  constructor(
    @InjectModel(
      OcrText,
      new ConfigService().get<string>('database_database_name'),
    )
    private readonly curriculum: typeof OcrText,
    private readonly elasticsearch: ElasticsearchService,
    private readonly httpService: HttpService,
  ) {}

  public async execute(command: CreateOcrTextDto): Promise<OcrText> {
    const created = await this.curriculum.create(command);

    const response = await this.generateStructuredDataFromText(command.Text);
    console.log(response);

    const dto = plainToInstance(StructuredDataDto, response);
    console.log(dto);

    return created;
  }

  async generateStructuredDataFromText(text: string): Promise<any> {
    const prompt = `based on the following text, return only the following structure as a JSON, do not make any kind of comments, only return the JSON, try to fill this structure:
    {
      "fullName": "",
      "email": "",
      "phone": "",
      "address": "",
      "profile": "",
      "degree": "",
      "institution": "",
      "startDateStudy": "",
      "endDateStudy": "",
      "position": "",
      "company": "",
      "startDateJob": "",
      "endDateJob": "",
      "currentJob": "",
      "responsibilities": "",
      "professionalSkills": "",
      "languages": ""
    } TEXT: ${text}`;

    const body = {
      model: 'llama3.2',
      prompt,
      system: 'talk like a IA Model',
      stream: false,
    };

    const response = await lastValueFrom(
      this.httpService.post('http://localhost:11434/api/generate', body),
    );
    console.log(response.data.response);

    return response.data.response;
  }
}
