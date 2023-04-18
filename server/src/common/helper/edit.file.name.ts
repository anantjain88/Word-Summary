import { extname } from 'path';

export const editFileName = (req, file, callback) => {
  /// get the original file name
  const name = file.originalname.split('.')[0];
  /// get the extension
  const extension = extname(file.originalname);
  callback(null, `${name}${extension}`);
};
