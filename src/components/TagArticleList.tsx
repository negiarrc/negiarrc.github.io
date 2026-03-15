import type { ArticleMetadata } from "@/types/article";

const articleDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type ArticleListProps = {
  articles: ArticleMetadata[];
  emptyMessage?: string;
  className?: string;
};

function articleHref(article: ArticleMetadata): string {
  return `/articles/${article.category}/${article.slug}`;
}

function ArticleMeta({ article }: { article: ArticleMetadata }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-subtle)]">
      <a href={`/categories/${article.category}`}>
        <span className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5">
          {article.category}
        </span>
      </a>
      <time dateTime={article.publishedAt.toISOString()}>
        {articleDateFormatter.format(article.publishedAt)}
      </time>
    </div>
  );
}

export function ArticleCardList({
  articles,
  emptyMessage,
  className,
}: ArticleListProps) {
  const baseClassName = className ?? "grid grid-cols-1 gap-4 md:grid-cols-2";

  if (articles.length === 0) {
    return (
      <p className="text-sm text-[var(--text-subtle)]">
        {emptyMessage ?? "まだ公開されている記事はありません。"}
      </p>
    );
  }

  return (
    <ul className={baseClassName}>
      {articles.map((article) => (
        <li key={`${article.category}-${article.slug}`}>
          <a
            href={articleHref(article)}
            className="block border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <img
              src={article.thumbnail}
              alt={`${article.title} thumbnail`}
              className="aspect-[16/9] w-full border border-[var(--border)] object-cover"
            />
            <div className="mt-3">
              <ArticleMeta article={article} />
              <h3 className="mt-2 text-base font-semibold">{article.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-subtle)]">
                {article.excerpt}
              </p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ArticleTextList({
  articles,
  emptyMessage,
  className,
}: ArticleListProps) {
  const baseClassName = className ?? "space-y-3";

  if (articles.length === 0) {
    return (
      <p className="text-sm text-[var(--text-subtle)]">
        {emptyMessage ?? "まだ公開されている記事はありません。"}
      </p>
    );
  }

  return (
    <ul className={baseClassName}>
      {articles.map((article) => (
        <li key={`${article.category}-${article.slug}`}>
          <a
            href={articleHref(article)}
            className="block border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <ArticleMeta article={article} />
            <h3 className="mt-2 text-base font-semibold">{article.title}</h3>
            <p className="mt-2 text-sm text-[var(--text-subtle)]">
              {article.excerpt}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
