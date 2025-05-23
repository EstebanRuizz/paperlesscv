import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';

import { lastValueFrom } from 'rxjs';
import { CvOCRDataDTO } from 'src/core/application/DTO/inner/CvOCRDataDTO';
import { SavedIdDataOCR } from 'src/core/application/DTO/inner/SavedIdDataOCR';
import { OcrText } from 'src/infrastructure/persistence/paperlesscv/configuration/OcrText';
import { CreateOcrTextDto } from '../../../DTO/http/curriculum/CreateOcrTextDto';

export class OCRTextService implements ICommandHandler<CreateOcrTextDto> {
  constructor(
    @InjectModel(
      OcrText,
      new ConfigService().get<string>('database_database_name'),
    )
    private readonly ocrText: typeof OcrText,
    private readonly httpService: HttpService,
  ) {}

  public async execute(command: CreateOcrTextDto): Promise<SavedIdDataOCR> {
    const response = await this.generateStructuredDataFromText(command.Text);

    command.Text = JSON.stringify(response);

    const created = await this.ocrText.create(command);

    return new SavedIdDataOCR(created.Id);
  }

  async generateStructuredDataFromText(text: string): Promise<CvOCRDataDTO> {
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
    } This is the TEXT, 
     i took from a OCR output so it can have some errors, 
     if there are multiple job expererience or study degrees, 
     only take the last one of both to match the current JSON format indicated lines before, 
     ENSURE JSON STRUCTURE RESULT IS CORRECT because i need to serealize as a JSON object before creating an instance to save in database: ${text}`;

    const body = {
      model: 'llama3.2',
      prompt,
      system: 'talk like a IA Model',
      stream: false,
    };

    let response: any = null;

    try {
      response = await lastValueFrom(
        this.httpService.post('http://localhost:11434/api/generate', body),
      );
    } catch (error) {
      console.log(error);
      throw new Error('Error generating structured data');
    }

    return this.buildCvOCRDataDTO(response);
  }

  private buildCvOCRDataDTO(response: any) {
    const jsonString = JSON.parse(
      response.data.response
        .trim()
        .replace(/^```[\s\S]*?\n/, '')
        .replace(/\n```$/, ''),
    );

    const CvOCRDataDTO: CvOCRDataDTO = {
      fullName: jsonString['fullName'],
      email: jsonString['email'],
      phone: jsonString['phone'],
      address: jsonString['address'],
      profile: jsonString['profile'],
      degree: jsonString['degree'],
      institution: jsonString['institution'],
      startDateStudy: jsonString['startDateStudy'],
      endDateStudy: jsonString['endDateStudy'],
      position: jsonString['position'],
      company: jsonString['company'],
      startDateJob: jsonString['startDateJob'],
      endDateJob: jsonString['endDateJob'],
      currentJob: jsonString['currentJob'],
      responsibilities: jsonString['responsibilities'],
      professionalSkills: jsonString['professionalSkills'],
      languages: jsonString['languages'],
    };
    return CvOCRDataDTO;
  }
}
