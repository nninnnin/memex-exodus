// file-map.json의 로컬 파일들을 S3에 업로드하고
// { originalUrl → s3Url } 형태의 s3-map을 반환한다.

import { readFileSync } from 'fs';
import { basename } from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export async function uploadFiles(
  fileMap: Record<string, string>,
  accessKeyId: string,
  secretAccessKey: string,
  bucket: string,
  region: string,
  prefix: string,
): Promise<Record<string, string>> {
  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  const s3Map: Record<string, string> = {};

  for (const [originalUrl, localPath] of Object.entries(fileMap)) {
    const filename = basename(localPath);
    const key = `${prefix}${filename}`;

    const upload = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: readFileSync(localPath),
      },
    });

    await upload.done();

    const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    s3Map[originalUrl] = s3Url;
    console.log(`uploaded: ${filename}`);
  }

  return s3Map;
}
