// fetchCollection이 반환한 아이템들에서 URL을 재귀적으로 탐색해
// 화이트리스트 확장자에 해당하는 파일만 data/files/ 에 다운로드한다.
// 필터링된 URL은 skipped-urls.json에 저장해 사용자가 검토할 수 있게 한다.

import { writeFileSync, mkdirSync, createWriteStream } from 'fs';
import { join, extname, basename } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const FILE_EXTENSIONS = new Set([
  '.glb', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.mp3', '.pdf',
]);

function extractUrls(value: unknown, found: string[] = []): string[] {
  if (typeof value === 'string') {
    try {
      const url = new URL(value);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        found.push(value);
      }
    } catch {}
  } else if (Array.isArray(value)) {
    for (const item of value) extractUrls(item, found);
  } else if (value !== null && typeof value === 'object') {
    for (const v of Object.values(value)) extractUrls(v, found);
  }
  return found;
}

function isDownloadable(url: string): boolean {
  const pathname = new URL(url).pathname;
  return FILE_EXTENSIONS.has(extname(pathname).toLowerCase());
}

export async function downloadFiles(
  items: unknown[],
  outDir: string,
  skippedPath: string,
): Promise<Record<string, string>> {
  mkdirSync(outDir, { recursive: true });

  const allUrls = items.flatMap(item => extractUrls(item));
  const unique = [...new Set(allUrls)];

  const toDownload = unique.filter(isDownloadable);
  const skipped = unique.filter(url => !isDownloadable(url));

  writeFileSync(skippedPath, JSON.stringify(skipped, null, 2));
  console.log(`skipped ${skipped.length} URLs → ${skippedPath}`);

  const fileMap: Record<string, string> = {};

  for (const url of toDownload) {
    const pathname = new URL(url).pathname;
    const filename = basename(pathname);
    const dest = join(outDir, filename);

    const res = await fetch(url);
    if (!res.ok || !res.body) {
      console.warn(`failed: ${url}`);
      continue;
    }

    await pipeline(Readable.fromWeb(res.body as any), createWriteStream(dest));
    fileMap[url] = dest;
    console.log(`downloaded: ${filename}`);
  }

  return fileMap;
}
