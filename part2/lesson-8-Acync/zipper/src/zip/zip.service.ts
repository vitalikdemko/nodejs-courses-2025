import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { performance } from 'perf_hooks';
import { Mutex } from 'async-mutex';
import { unzip } from '../utils/unzip.js';
import { Worker } from 'worker_threads';
import { SharedState } from 'src/types/shared-state.interface';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class ZipService {
  async processZip(zipPath: string) {
    const t0 = performance.now();

    const id = randomUUID();
    //const tmpDir = path.join('/tmp', id);
    const outputDir = path.join(process.cwd(), 'output', id);
    await fs.mkdir(outputDir, { recursive: true });

    const imagePaths = await unzip(zipPath, outputDir);
    console.log('imagePaths', imagePaths);

    const state: SharedState = { processed: 0, skipped: 0 };
    const mutex = new Mutex();

    const workers = imagePaths.map((imagePath) =>
      this.runWorkerForImage(imagePath, outputDir, state, mutex),
    );

    await Promise.all(workers);

    //await fs.rm(outputDir, { recursive: true, force: true });
    await fs.rm(zipPath, { force: true });

    const durationMs = performance.now() - t0;

    return {
      id,
      processed: state.processed,
      skipped: state.skipped,
      durationMs: Math.round(durationMs),
    };
  }

  private runWorkerForImage(imagePath: string, outputDir: string, state: SharedState, mutex: Mutex): Promise<void> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('../worker/thumbnail.worker.js', import.meta.url),
        {
          workerData: { path: imagePath, outputDir },
          // @ts-expect-error: 'type' is valid in Node.js ESM
          type: 'module',
        },
      );

    worker.once('message', (result: 'processed' | 'skipped') => {
      void (async () => {
        const release = await mutex.acquire();
        try {
          state[result]++;
          resolve();
        } finally {
          release();
        }
      })();
    });

      worker.once('error', reject);
      worker.once('exit', (code: any) => {
        if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
      });
    });
  }
}
