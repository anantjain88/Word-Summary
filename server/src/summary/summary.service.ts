import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Style,
  StyleForParagraph,
  TextRun,
} from 'docx';
import { Stream } from 'stream';
import * as mammoth from 'mammoth';
import { ConfigService } from '@nestjs/config';
import createReport from 'docx-templates';
import { log } from 'console';
import { OpenAI } from 'langchain';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { loadSummarizationChain } from 'langchain/chains';

const { Configuration, OpenAIApi } = require('openai');

@Injectable()
export class SummaryService {
  constructor(private readonly configService: ConfigService) {}

  async create(body) {
    let response = [];
    /// set the directory path to read the words files
    const directoryPath = path.join(__dirname, '../../', 'uploads');
    /// openai configuration
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const myPromise = new Promise((resolve, reject) => {
      /// reading the directory
      fs.readdir(directoryPath, async (err, files) => {
        if (err) {
          console.log('Unable to scan directory: ' + err);
          reject(err); // reject the promise if there's an error
        }
        /// process the files
        const promises = files.map(async (file) => {
          /// file path
          const path = `${directoryPath}/${file}`;
          /// read the file contents
          const result = await mammoth.extractRawText({
            path: path,
          });
          const content = result.value;
          // console.log(content);

          // const augmented_prompt = 'summarize this text: ' + content;
          const augmented_prompt = content + ' TL;DR 1 page';

          let completion;
          let paras = [];

          //// using the recursion techniquie to summarize the document
          const model = new OpenAI({
            temperature: parseFloat(body.temperature),
            modelName: body.model,
            maxTokens: 1000,
            openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
          });
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            // chunkOverlap:1
          });
          const docs = await textSplitter.createDocuments([content]);

          // This convenience function creates a document chain prompted to summarize a set of documents.
          const chain = loadSummarizationChain(model);
          const res = await chain.call({
            input_documents: docs,
            input_text: 'generate one page summary',
            max_output_length: 1000,
          });

          // console.log({ res });
          res.text.split('.').forEach((lines) => {
            if (lines != '') {
              paras.push(
                new Paragraph({
                  bullet: { level: 0 },
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: {
                    before: 200,
                  },
                  text: lines,
                }),
              );
            }
          });

          const doc = new Document({
            /// creating new doc content to add in word file
            sections: [
              {
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: 'Summary',
                        font: 'calibri',
                        bold: true,
                        allCaps: true,
                        color: '#ff0000',
                      }),
                    ],
                  }),

                  ...paras,
                ],
              },
            ],
          });

          /// Binding the content to word file
          const fileDetails = file.split('.');

          Packer.toBuffer(doc).then((buffer) => {
            fs.writeFile(
              `${directoryPath}/${fileDetails[0]}-summary.${fileDetails[1]}`,
              buffer,
              (err) => {
                if (err) throw err;
                console.log('Summary generated successfully....');
              },
            );
          });

          return {
            filename: file,
            summary: res.text,
          };
          // return 'fd';
        });

        try {
          response = await Promise.all(promises);
          resolve(response); // resolve the promise with the response array
        } catch (error) {
          reject(error); // reject the promise if there's an error in the Promise.all() block
        }
      });
    });

    return myPromise
      .then((val) => {
        return val;
      })
      .catch((err) => {
        return err.response.data.error.message;
        // console.log('Error:', err.response.data.error.message);
      });
  }

  findAll() {
    return `This action returns all summary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} summary`;
  }

  update(id: number, updateSummaryDto: UpdateSummaryDto) {
    return `This action updates a #${id} summary`;
  }

  remove(id: number) {
    return `This action removes a #${id} summary`;
  }
}
