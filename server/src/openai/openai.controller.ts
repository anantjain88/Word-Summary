import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const { Configuration, OpenAIApi } = require('openai');
@Controller('openai')
export class OpenaiController {
  constructor(private readonly configService: ConfigService) {}
  
  configuration = new Configuration({
    apiKey: this.configService.get<string>('OPENAI_API_KEY'),
  });
}
