import * as fs from 'fs';
import * as crypto from 'crypto';

export function calculateFileMD5(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('md5');
      const stream = fs.createReadStream(filePath);
  
      stream.on('data', (data) => {
        hash.update(data);
      });
  
      stream.on('end', () => {
        const md5 = hash.digest('hex');
        resolve(md5);
      });
  
      stream.on('error', (error) => {
        reject(error);
      });
    });
  }