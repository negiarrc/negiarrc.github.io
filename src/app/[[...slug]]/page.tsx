import { evaluate } from "@mdx-js/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { getSitePageByRouteSegments, listAllSitePagesMetadata } from "@/lib/pages/loader";
import { sharedMdxComponents } from "@/mdx-components";
import type { SitePageMetadata } from "@/types/site-page";

type SitePageRouteParams = {
  slug?: string[];
};

type SitePageStaticParams = Required<SitePageRouteParams>;

type SitePageProps = {
  params: Promise<SitePageRouteParams>;
};

type MdxComponentProps = {
  components?: typeof sharedMdxComponents;
};

export const dynamicParams = false;

const STATIC_EXPORT_PLACEHOLDER_SEGMENT = "__static-export-placeholder__";
const STATIC_EXPORT_PLACEHOLDER_PARAMS: SitePageStaticParams = {
  slug: [STATIC_EXPORT_PLACEHOLDER_SEGMENT],
};

function normalizeSlugSegments(slug: string[] | undefined): string[] {
  return slug ?? [];
}

function isStaticExportPlaceholderParams(params: SitePageRouteParams): boolean {
  const segments = normalizeSlugSegments(params.slug);

  return segments.length === 1 && segments[0] === STATIC_EXPORT_PLACEHOLDER_SEGMENT;
}

function buildPageMetadata(page: SitePageMetadata): Metadata {
  return {
    title: page.title,
    ...(page.description ? { description: page.description } : {}),
  };
}

async function renderPageBody(source: string): Promise<ReactElement> {
  const mdxModule = await evaluate(source, {
    ...jsxRuntime,
  });
  const MdxContent = mdxModule.default as (props: MdxComponentProps) => ReactElement;

  return <MdxContent components={sharedMdxComponents} />;
}

export function generateStaticParams(): SitePageStaticParams[] {
  const pageParams = listAllSitePagesMetadata().map((page) => ({
    slug: page.routeSegments,
  }));

  if (pageParams.length > 0) {
    return pageParams;
  }

  // Next.js static export requires at least one prerendered dynamic route.
  return [STATIC_EXPORT_PLACEHOLDER_PARAMS];
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isStaticExportPlaceholderParams({ slug })) {
    return {};
  }

  const page = getSitePageByRouteSegments(normalizeSlugSegments(slug));
  if (!page) {
    return {};
  }

  return buildPageMetadata(page.metadata);
}

export default async function Page({ params }: SitePageProps) {
  const { slug } = await params;
  if (isStaticExportPlaceholderParams({ slug })) {
    notFound();
  }

  const page = getSitePageByRouteSegments(normalizeSlugSegments(slug));
  if (!page) {
    notFound();
  }

  const pageBody = await renderPageBody(page.content);

  return <div className="article-mdx">{pageBody}</div>;
}
