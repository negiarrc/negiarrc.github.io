export type ArticleFrontmatter = {
  title: string;
  thumbnail: string;
  publishedAt: string;
  excerpt: string;
  category: string;
  slug: string;
};

export type ArticleMetadata = Omit<ArticleFrontmatter, "publishedAt"> & {
  publishedAt: Date;
};
