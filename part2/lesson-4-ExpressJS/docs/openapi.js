import { registry } from '../openapi/registry.js';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

import YAML from 'yaml';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const createZodSpec = () => {
  const yamlPath = path.resolve(process.cwd(), 'docs', 'brews.yaml');
  const uploadSpec = YAML.parse(readFileSync(yamlPath, 'utf8'));

  const zodSpec = new OpenApiGeneratorV3(registry.definitions).generateDocument({
    info: { title: 'Coffee Brew API', version: '1.0' }
  });

  zodSpec.paths = { ...zodSpec.paths, ...uploadSpec.paths };
  zodSpec.components = {
    ...zodSpec.components,
    schemas: {
      ...(zodSpec.components?.schemas || {}),
      ...(uploadSpec.components?.schemas || {})
    }
  };

  return zodSpec;
};