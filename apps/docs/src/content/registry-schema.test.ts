/**
 * Keeps registry/registry.schema.json in step with the Zod registry schema in
 * ./schema.ts. The test is the generator: it emits the JSON Schema and
 * compares it against the committed file, so a stale file fails CI with a
 * diff, and rerunning the test with -u rewrites the file. Prettier skips the
 * file, so the two-space JSON written here is the format it keeps.
 */
import { expect, it } from 'vitest';
import { z } from 'zod';

import { registrySchema } from './schema';

const SCHEMA_PATH = '../../../../registry/registry.schema.json';

it('registry.schema.json is generated from registrySchema', async () => {
  const schema = z.toJSONSchema(registrySchema, { target: 'draft-07' });

  await expect(`${JSON.stringify(schema, null, 2)}\n`).toMatchFileSnapshot(SCHEMA_PATH);
});
