import type { ArticleMetadata } from "@/types/article";
import type { Robot } from "@/types/content";

const articleDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type RobotImageListProps = {
  robots: Robot[];
  onSelectRobot: (robot: Robot) => void;
  className?: string;
};

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
      <span className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5">
        {article.category}
      </span>
      <time dateTime={article.publishedAt.toISOString()}>
        {articleDateFormatter.format(article.publishedAt)}
      </time>
    </div>
  );
}

export function RobotImageList({
  robots,
  onSelectRobot,
  className,
}: RobotImageListProps) {
  const baseClassName =
    className ?? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  if (robots.length === 0) {
    return (
      <p className="text-sm text-[var(--text-subtle)]">
        掲載できるロボット情報はまだありません。
      </p>
    );
  }

  return (
    <ul className={baseClassName}>
      {robots.map((robot) => (
        <li key={robot.id}>
          <button
            type="button"
            onClick={() => onSelectRobot(robot)}
            className="w-full border border-[var(--border)] bg-[var(--surface)] p-3 text-left"
            aria-label={`${robot.name} の画像を拡大`}
          >
            <img
              src={robot.imagePath}
              alt={robot.imageAlt}
              className="aspect-[4/3] w-full border border-[var(--border)] object-cover"
            />
            <p className="mt-3 text-xs text-[var(--text-subtle)]">{robot.year}</p>
            <h3 className="mt-1 text-base font-semibold">{robot.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">{robot.role}</p>
            <p className="mt-3 text-sm text-[var(--text-subtle)]">
              {robot.description}
            </p>
          </button>
        </li>
      ))}
    </ul>
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
