import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { normalizeArticleSlug, parseArticleMetadata } from "@/lib/articles/frontmatter";
import type { ArticleMetadata } from "@/types/article";

const ARTICLES_ROOT_DIRECTORY = path.join(process.cwd(), "content", "articles");

export type ArticleDocument = {
  readonly metadata: ArticleMetadata;
  readonly content: string;
};

type ArticleRecord = ArticleDocument & {
  readonly filePath: string;
};

function compareArticleMetadata(left: ArticleMetadata, right: ArticleMetadata): number {
  const publishedAtDifference = right.publishedAt.getTime() - left.publishedAt.getTime();
  if (publishedAtDifference !== 0) {
    return publishedAtDifference;
  }

  const categoryDifference = left.category.localeCompare(right.category);
  if (categoryDifference !== 0) {
    return categoryDifference;
  }

  return left.slug.localeCompare(right.slug);
}

function normalizeCategorySegment(category: string): string | null {
  const normalizedCategory = category.trim().replace(/^\/+|\/+$/g, "");
  if (!normalizedCategory) {
    return null;
  }

  if (
    normalizedCategory === "." ||
    normalizedCategory === ".." ||
    normalizedCategory.includes("/") ||
    normalizedCategory.includes("\\")
  ) {
    return null;
  }

  return normalizedCategory;
}

function normalizeSlugSegment(slug: string): string | null {
  let normalizedSlug: string;

  try {
    normalizedSlug = normalizeArticleSlug(slug);
  } catch {
    return null;
  }

  if (
    normalizedSlug === "." ||
    normalizedSlug === ".." ||
    normalizedSlug.includes("/") ||
    normalizedSlug.includes("\\")
  ) {
    return null;
  }

  return normalizedSlug;
}

function listCategoryDirectories(): string[] {
  if (!fs.existsSync(ARTICLES_ROOT_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(ARTICLES_ROOT_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function listArticleFilesForCategory(category: string): string[] {
  const categoryDirectory = path.join(ARTICLES_ROOT_DIRECTORY, category);
  if (!fs.existsSync(categoryDirectory)) {
    return [];
  }

  return fs
    .readdirSync(categoryDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".mdx")
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function readArticleRecord(filePath: string, category: string): ArticleRecord {
  const slug = normalizeArticleSlug(path.basename(filePath, path.extname(filePath)));
  const source = fs.readFileSync(filePath, "utf8");
  const parsedSource = matter(source);
  const metadata = parseArticleMetadata(parsedSource.data, { slug });

  if (metadata.category !== category) {
    throw new Error(
      `Article category mismatch in "${filePath}". Expected "${category}" but got "${metadata.category}".`,
    );
  }

  return {
    filePath,
    metadata,
    content: parsedSource.content,
  };
}

function listAllArticleRecords(): ArticleRecord[] {
  const articles: ArticleRecord[] = [];

  for (const category of listCategoryDirectories()) {
    for (const fileName of listArticleFilesForCategory(category)) {
      const filePath = path.join(ARTICLES_ROOT_DIRECTORY, category, fileName);
      articles.push(readArticleRecord(filePath, category));
    }
  }

  return articles.sort((left, right) => compareArticleMetadata(left.metadata, right.metadata));
}

export function listAllArticlesMetadata(): ArticleMetadata[] {
  return listAllArticleRecords().map((article) => article.metadata);
}

export function listArticlesMetadataByCategory(category: string): ArticleMetadata[] {
  const normalizedCategory = normalizeCategorySegment(category);
  if (!normalizedCategory) {
    return [];
  }

  return listAllArticlesMetadata().filter(
    (article) => article.category === normalizedCategory,
  );
}

export function getArticleByCategoryAndSlug(
  category: string,
  slug: string,
): ArticleDocument | null {
  const normalizedCategory = normalizeCategorySegment(category);
  if (!normalizedCategory) {
    return null;
  }

  const normalizedSlug = normalizeSlugSegment(slug);
  if (!normalizedSlug) {
    return null;
  }

  const filePath = path.join(
    ARTICLES_ROOT_DIRECTORY,
    normalizedCategory,
    `${normalizedSlug}.mdx`,
  );
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const article = readArticleRecord(filePath, normalizedCategory);
  return {
    metadata: article.metadata,
    content: article.content,
  };
}
