/**
 * The registry parser's containment promise: every source path in the
 * manifest stays relative to the registry root. The CLI re-checks this when it
 * writes files, so these cases pin the schema's own guard, which is also the
 * `pattern` that registry/registry.schema.json carries.
 */
import { describe, expect, it } from 'vitest';

import { parseRegistry } from './schema';

function manifestWith(file: string) {
  return {
    version: '1',
    components: {
      demo: { file, description: 'A demo.', dependencies: [], category: 'gradients' },
    },
  };
}

describe('parseRegistry source paths', () => {
  it.each(['demo/demo.tsx', 'utils/color.ts'])('accepts %s', (file) => {
    expect(() => parseRegistry(manifestWith(file), 'registry.json')).not.toThrow();
  });

  it.each([
    '../outside.ts',
    'a/../outside.tsx',
    '/absolute.ts',
    'C:/outside.ts',
    '..\\outside.ts',
    'demo\\demo.tsx',
    'demo/demo.css',
  ])('rejects %s', (file) => {
    expect(() => parseRegistry(manifestWith(file), 'registry.json')).toThrow(
      /Invalid registry file/,
    );
  });
});
