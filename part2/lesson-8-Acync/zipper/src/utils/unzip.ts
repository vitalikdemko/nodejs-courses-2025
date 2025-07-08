import AdmZip from 'adm-zip';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function unzip(
  zipPath: string,
  outputDir: string,
): Promise<string[]> {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputDir, true);

  return await getAllImages(outputDir);
}

async function getAllImages(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return await getAllImages(fullPath);
      } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
        return fullPath;
      } else {
        return null;
      }
    })
  );

  return files.flat().filter(Boolean) as string[];
}
