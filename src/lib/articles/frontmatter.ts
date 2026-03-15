import type { ArticleFrontmatter, ArticleMetadata } from "@/types/article";

type FrontmatterRecord = Record<string, unknown>;

export type ParseArticleFrontmatterOptions = {
  slug?: string;
};

function assertFrontmatterRecord(value: unknown): FrontmatterRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Article frontmatter must be an object.");
  }

  return value as FrontmatterRecord;
}

function normalizeRequiredString(
  value: unknown,
  fieldName: keyof ArticleFrontmatter,
): string {
  if (typeof value !== "string") {
    throw new Error(`Article frontmatter "${fieldName}" must be a string.`);
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    throw new Error(`Article frontmatter "${fieldName}" cannot be empty.`);
  }

  return normalizedValue;
}

function normalizeSlug(value: unknown): string {
  const slug = normalizeRequiredString(value, "slug");
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, "");

  if (!normalizedSlug) {
    throw new Error('Article frontmatter "slug" cannot be only slashes.');
  }

  return normalizedSlug;
}

function normalizePublishedAt(value: string): Date {
  const publishedAt = new Date(value);

  if (Number.isNaN(publishedAt.getTime())) {
    throw new Error(
      'Article frontmatter "publishedAt" must be a valid date string.',
    );
  }

  return publishedAt;
}

export function normalizeArticleSlug(slug: string): string {
  return normalizeSlug(slug);
}

export function parseArticleFrontmatter(
  rawFrontmatter: unknown,
  options: ParseArticleFrontmatterOptions = {},
): ArticleFrontmatter {
  const frontmatter = assertFrontmatterRecord(rawFrontmatter);
  const slugSource = options.slug ?? frontmatter.slug;

  return {
    title: normalizeRequiredString(frontmatter.title, "title"),
    thumbnail: normalizeRequiredString(frontmatter.thumbnail, "thumbnail"),
    publishedAt: normalizeRequiredString(frontmatter.publishedAt, "publishedAt"),
    excerpt: normalizeRequiredString(frontmatter.excerpt, "excerpt"),
    category: normalizeRequiredString(frontmatter.category, "category"),
    slug: normalizeSlug(slugSource),
  };
}

export function normalizeArticleMetadata(
  frontmatter: ArticleFrontmatter,
): ArticleMetadata {
  return {
    title: frontmatter.title.trim(),
    thumbnail: frontmatter.thumbnail.trim(),
    publishedAt: normalizePublishedAt(frontmatter.publishedAt),
    excerpt: frontmatter.excerpt.trim(),
    category: frontmatter.category.trim(),
    slug: normalizeArticleSlug(frontmatter.slug),
  };
}

export function parseArticleMetadata(
  rawFrontmatter: unknown,
  options: ParseArticleFrontmatterOptions = {},
): ArticleMetadata {
  return normalizeArticleMetadata(parseArticleFrontmatter(rawFrontmatter, options));
}
