import { ConfigService } from '@nestjs/config';
import { IQueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { OcrText } from 'src/infrastructure/persistence/paperlesscv/configuration/OcrText';

export class GetByIdOcrText implements IQueryHandler<string> {
  constructor(
    @InjectModel(
      OcrText,
      new ConfigService().get<string>('database_database_name'),
    )
    private readonly ocrText: typeof OcrText,
  ) {}

  public async execute(query: string): Promise<OcrText> {
    return await this.ocrText.findByPk(query);
  }
}
