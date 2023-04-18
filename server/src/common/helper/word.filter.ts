import { BadRequestException } from '@nestjs/common';

export const wordFileFilter = (req, file, callback) => {
  /// check if the file is .docx
  if (!file.originalname.match(/\.(docx)$/)) {
    return callback(
      new BadRequestException('Only docx files are allowed!'),
      false,
    );
  }
  callback(null, true);
};
