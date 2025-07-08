import { basename, join } from 'path';
import { workerData, parentPort } from 'worker_threads';
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

const outputDir = workerData.outputDir;
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

const fileName = basename(workerData.path);
const outputPath = join(outputDir, fileName);

try {
  await sharp(workerData.path).resize(150).toFile(outputPath);
  parentPort?.postMessage('processed');
} catch (error) {
  parentPort?.postMessage('skipped');
}
