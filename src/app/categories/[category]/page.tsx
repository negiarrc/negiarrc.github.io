import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTextList } from "@/components/TagArticleList";
import {
  listAllArticlesMetadata,
  listArticlesMetadataByCategory,
} from "@/lib/articles/loader";

type CategoryPageRouteParams = {
  category: string;
};

type CategoryPageProps = {
  params: Promise<CategoryPageRouteParams>;
};

export const dynamicParams = false;

const STATIC_EXPORT_PLACEHOLDER_PARAMS: CategoryPageRouteParams = {
  category: "__static-export-placeholder__",
};

function isStaticExportPlaceholderParams(
  params: CategoryPageRouteParams,
): boolean {
  return params.category === STATIC_EXPORT_PLACEHOLDER_PARAMS.category;
}

function listCategoryRouteParams(): CategoryPageRouteParams[] {
  const categories = Array.from(
    new Set(listAllArticlesMetadata().map((article) => article.category)),
  ).sort((left, right) => left.localeCompare(right));

  return categories.map((category) => ({ category }));
}

function buildCategoryPageMetadata(category: string, articleCount: number): Metadata {
  return {
    title: `${category} の記事一覧`,
    description: `${category} カテゴリで公開している記事 ${articleCount} 件の一覧です。`,
  };
}

export function generateStaticParams(): CategoryPageRouteParams[] {
  const categoryParams = listCategoryRouteParams();

  if (categoryParams.length > 0) {
    return categoryParams;
  }

  // Next.js static export requires at least one prerendered dynamic route.
  return [STATIC_EXPORT_PLACEHOLDER_PARAMS];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (isStaticExportPlaceholderParams({ category })) {
    return {};
  }

  const articles = listArticlesMetadataByCategory(category);
  if (articles.length === 0) {
    return {};
  }

  return buildCategoryPageMetadata(articles[0].category, articles.length);
}

export default async function Page({ params }: CategoryPageProps) {
  const { category } = await params;
  if (isStaticExportPlaceholderParams({ category })) {
    notFound();
  }

  const articles = listArticlesMetadataByCategory(category);
  if (articles.length === 0) {
    notFound();
  }

  const resolvedCategory = articles[0].category;

  return (
    <section className="space-y-6">
      <header className="space-y-3 border-b border-[var(--border)] pb-6">
        <p className="text-sm text-[var(--text-subtle)]">
          <a href="/articles">記事一覧</a>
        </p>
        <h1 className="text-3xl font-bold">{resolvedCategory} の記事一覧</h1>
        <p className="text-sm text-[var(--text-subtle)]">
          公開している記事: {articles.length} 件
        </p>
      </header>

      <ArticleTextList
        articles={articles}
        emptyMessage="このカテゴリの記事はまだありません。"
      />
    </section>
  );
}
