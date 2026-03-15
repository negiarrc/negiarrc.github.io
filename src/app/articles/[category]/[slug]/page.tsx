import { evaluate } from "@mdx-js/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { sharedMdxComponents } from "@/mdx-components";
import {
  getArticleByCategoryAndSlug,
  listAllArticlesMetadata,
} from "@/lib/articles/loader";
import type { ArticleMetadata } from "@/types/article";

type ArticlePageRouteParams = {
  category: string;
  slug: string;
};

type ArticlePageProps = {
  params: Promise<ArticlePageRouteParams>;
};

type MdxComponentProps = {
  components?: typeof sharedMdxComponents;
};

export const dynamicParams = false;
const STATIC_EXPORT_PLACEHOLDER_PARAMS: ArticlePageRouteParams = {
  category: "__static-export-placeholder__",
  slug: "__static-export-placeholder__",
};

function formatArticleDate(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function buildPageMetadata(article: ArticleMetadata): Metadata {
  const title = article.title;
  const description = article.excerpt;
  const thumbnail = article.thumbnail.trim();

  const metadata: Metadata = {
    title,
    description,
  };

  if (thumbnail) {
    metadata.openGraph = {
      type: "article",
      title,
      description,
      images: [{ url: thumbnail }],
    };
    metadata.twitter = {
      card: "summary_large_image",
      title,
      description,
      images: [thumbnail],
    };
  }

  return metadata;
}

async function renderArticleBody(source: string): Promise<ReactElement> {
  const mdxModule = await evaluate(source, {
    ...jsxRuntime,
  });
  const MdxContent = mdxModule.default as (
    props: MdxComponentProps,
  ) => ReactElement;

  return <MdxContent components={sharedMdxComponents} />;
}

function isStaticExportPlaceholderParams(
  params: ArticlePageRouteParams,
): boolean {
  return (
    params.category === STATIC_EXPORT_PLACEHOLDER_PARAMS.category &&
    params.slug === STATIC_EXPORT_PLACEHOLDER_PARAMS.slug
  );
}

export function generateStaticParams(): ArticlePageRouteParams[] {
  const articleParams = listAllArticlesMetadata().map((article) => ({
    category: article.category,
    slug: article.slug,
  }));

  if (articleParams.length > 0) {
    return articleParams;
  }

  // Next.js static export requires at least one prerendered dynamic route.
  return [STATIC_EXPORT_PLACEHOLDER_PARAMS];
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  if (isStaticExportPlaceholderParams({ category, slug })) {
    return {};
  }

  const article = getArticleByCategoryAndSlug(category, slug);
  if (!article) {
    return {};
  }

  return buildPageMetadata(article.metadata);
}

export default async function Page({ params }: ArticlePageProps) {
  const { category, slug } = await params;
  if (isStaticExportPlaceholderParams({ category, slug })) {
    notFound();
  }

  const article = getArticleByCategoryAndSlug(category, slug);
  if (!article) {
    notFound();
  }

  const articleBody = await renderArticleBody(article.content);

  return (
    <article className="space-y-8">
      <header className="space-y-4 border-b border-[var(--border)] pb-6">
        <p className="text-sm text-[var(--text-subtle)]">
          <a href="/articles">記事一覧</a> / {article.metadata.category}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-subtle)]">
          <span className="border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5">
            {article.metadata.category}
          </span>
          <time dateTime={article.metadata.publishedAt.toISOString()}>
            {formatArticleDate(article.metadata.publishedAt)}
          </time>
        </div>

        <h1 className="text-3xl font-bold">{article.metadata.title}</h1>
        {/* <p className="text-sm text-[var(--text-subtle)]">
          {article.metadata.excerpt}
        </p>

        <img
          src={article.metadata.thumbnail}
          alt={`${article.metadata.title} thumbnail`}
          className="w-full border border-[var(--border)] bg-[var(--surface)]"
        /> */}
      </header>

      <div className="article-mdx">{articleBody}</div>
    </article>
  );
}
