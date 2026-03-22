import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { promptUploadConfig } from "../config/upload";
import { uploadFiles } from "./upload/uploadFiles/index";

export async function upload() {
  const { projectName, accessKeyId, secretAccessKey, bucket, region, prefix } =
    await promptUploadConfig();
  const DATA_DIR = `./data/${projectName}`;

  if (!existsSync(DATA_DIR)) {
    throw new Error(`프로젝트 폴더가 없습니다: ${DATA_DIR}\npull을 먼저 실행하세요.`);
  }

  const fileMap: Record<string, string> = JSON.parse(
    readFileSync(join(DATA_DIR, "file-map.json"), "utf-8"),
  );

  console.log(`uploading ${Object.keys(fileMap).length} files...`);

  const s3Map = await uploadFiles(
    fileMap,
    accessKeyId,
    secretAccessKey,
    bucket,
    region,
    prefix,
  );

  writeFileSync(join(DATA_DIR, "s3-map.json"), JSON.stringify(s3Map, null, 2));
  console.log(`done. s3-map.json saved.`);
}
