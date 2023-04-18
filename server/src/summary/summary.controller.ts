import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { SummaryService } from './summary.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../common/helper/edit.file.name';
import { wordFileFilter } from '../common/helper/word.filter';
import { Response, response } from 'express';
import { resolve } from 'path';

@Controller('summarize')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Post()
  @UseInterceptors(
    /// the arguments are fieldname, maxcount, local options
    FilesInterceptor('file', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: wordFileFilter,
    }),
  )
  async create(@UploadedFiles() files, @Body() body, @Res() res: Response) {
    const serviceResponse = await this.summaryService.create(body);

    res.send(serviceResponse);
    // return val;

    // return response.send(serviceResponse);
  }

  @Get()
  findAll() {
    return this.summaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.summaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSummaryDto: UpdateSummaryDto) {
    return this.summaryService.update(+id, updateSummaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.summaryService.remove(+id);
  }
}
