import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { promptUploadConfig } from "../config/upload";
import { uploadFiles } from "./upload/uploadFiles/index";

const DATA_DIR = "./data";

export async function upload() {
  const { accessKeyId, secretAccessKey, bucket, region, prefix } =
    await promptUploadConfig();

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
