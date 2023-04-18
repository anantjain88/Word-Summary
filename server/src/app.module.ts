import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { SummaryModule } from './summary/summary.module';
import { OpenaiController } from './openai/openai.controller';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [ConfigModule.forRoot({ envFilePath, isGlobal: true }), SummaryModule],
  controllers: [AppController, OpenaiController],
  providers: [AppService],
})
export class AppModule {}
