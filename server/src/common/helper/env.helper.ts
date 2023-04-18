import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filepath: string = resolve(`${dest}/${filename}`);

  console.log(filepath);
  if (!existsSync(filepath)) {
    filepath = fallback;
  }
  return filepath;
}
