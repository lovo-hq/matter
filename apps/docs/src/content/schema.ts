import { z } from 'zod';

import { CATEGORY_SLUGS } from './taxonomy';
import type { DocsFrontmatter } from './types';

const sectionEnum = z.enum(['overview', 'guides', 'react.guides', 'react.api', 'reference']);

const rawFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  section: sectionEnum,
  order: z.number(),
  navTitle: z.string().optional(),
  hidden: z.boolean().optional(),
  status: z.enum(['draft', 'ready']).optional(),
  tags: z.array(z.string()).optional(),
});

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join('.');

      return `  - ${path === '' ? '<root>' : path}: ${issue.message}`;
    })
    .join('\n');
}

export function parseFrontmatter(data: unknown, sourcePath: string): DocsFrontmatter {
  const result = rawFrontmatterSchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid frontmatter in ${sourcePath}:\n${formatZodError(result.error)}`);
  }
  const frontmatterData = result.data;

  return {
    title: frontmatterData.title,
    description: frontmatterData.description,
    section: frontmatterData.section,
    order: frontmatterData.order,
    navTitle: frontmatterData.navTitle ?? frontmatterData.title,
    hidden: frontmatterData.hidden ?? false,
    status: frontmatterData.status ?? 'ready',
    tags: frontmatterData.tags ?? [],
  };
}

// ----------------------------------------------------------------------------
// The registry manifest
// ----------------------------------------------------------------------------

// The registry schema is the source of truth for registry/registry.schema.json:
// the registry-schema test emits that file from it with z.toJSONSchema and
// fails when the committed copy is stale. So everything the JSON Schema says,
// from descriptions to the path pattern, lives here, and `.meta({ id })` names
// the two shapes that come out as shared definitions.

// A .ts or .tsx path relative to the registry root, kept inside it: no
// leading slash or backslash, no drive letter, no backslash anywhere (the
// manifest spells paths with forward slashes only), and no `..` segment. The
// CLI re-checks containment when it writes, so this is the authoring-time
// guard that keeps the schema's promise honest rather than the last line.
// Zod copies the regex's source into the JSON Schema `pattern`, where V8
// spells each `/` as `\/`. JSON Schema reads patterns as ECMA 262 regexes,
// so the escape changes nothing.
const sourcePathSchema = z
  .string()
  .regex(/^(?![\/\\]|[A-Za-z]:)(?!.*(^|\/)\.\.(\/|$))[^\\]*\.tsx?$/)
  .meta({
    id: 'sourcePath',
    description:
      "A .ts or .tsx path relative to the registry root. Must stay inside it: the CLI writes these into a user's project, and refuses any path that resolves outside the configured components directory.",
  });

const registryComponentSchema = z
  .strictObject({
    file: sourcePathSchema.describe(
      'Entry point, relative to the registry root: the wrapper the user imports.',
    ),
    files: z
      .array(sourcePathSchema)
      .meta({
        description:
          'Every other source the component needs, relative to the registry root: its shader, plus any shared helper under utils/. The CLI leaves relative import specifiers alone, so anything a listed file imports must itself be listed or the install will not compile.',
        uniqueItems: true,
      })
      .optional(),
    description: z.string().min(1).describe('One line, shown by `shaders-cli list`.'),
    dependencies: z.array(z.string()).meta({
      description:
        'npm packages the component needs. Printed as an install hint after `shaders-cli add`.',
      uniqueItems: true,
    }),
    uses_primitives: z
      .array(z.string())
      .meta({
        description:
          'Tier 2 primitives the component builds on. Documentation only; the CLI does not read it.',
        uniqueItems: true,
      })
      .optional(),
    category: z
      .enum(CATEGORY_SLUGS)
      .describe(
        'The leaf group the docs sidebar files the component under. The label, tier, and order of each group live in apps/docs/src/content/taxonomy.ts; the CLI does not read it.',
      ),
  })
  .meta({ id: 'entry' });

export const registrySchema = z
  .strictObject({
    $schema: z.string().optional(),
    version: z
      .string()
      .min(1)
      .describe('Registry format version, independent of the package versions.'),
    components: z
      .record(z.string(), registryComponentSchema)
      .describe('Component slug to entry. The slug is what a user passes to `shaders-cli add`.'),
  })
  .meta({
    $id: 'https://github.com/campdotdev/shaders/blob/main/registry/registry.schema.json',
    title: 'Shaders registry index',
    description:
      "The index @camp-dev/shaders-cli reads to copy Tier 1 components into a user's project. Generated from registrySchema in apps/docs/src/content/schema.ts by the registry-schema test; edit that file and rerun the test with -u rather than editing this one.",
  });

export type RegistryFile = z.infer<typeof registrySchema>;

export function parseRegistry(data: unknown, sourcePath: string): RegistryFile {
  const result = registrySchema.safeParse(data);

  if (!result.success) {
    throw new Error(`Invalid registry file at ${sourcePath}:\n${formatZodError(result.error)}`);
  }

  return result.data;
}
