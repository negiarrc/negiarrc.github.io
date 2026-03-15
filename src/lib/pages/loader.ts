import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  normalizeSitePagePathname,
  normalizeSitePageRouteSegments,
  parseSitePageMetadataFromFilePath,
} from "@/lib/pages/frontmatter";
import type { SitePageMetadata } from "@/types/site-page";

const SITE_PAGES_ROOT_DIRECTORY = path.join(process.cwd(), "content", "pages");
const MDX_EXTENSION = ".mdx";

export type SitePageDocument = {
  readonly metadata: SitePageMetadata;
  readonly content: string;
  readonly filePath: string;
};

function compareSitePageMetadata(left: SitePageMetadata, right: SitePageMetadata): number {
  const pathnameDifference = left.pathname.localeCompare(right.pathname);
  if (pathnameDifference !== 0) {
    return pathnameDifference;
  }

  return left.title.localeCompare(right.title);
}

function compareHeaderNavigationPages(left: SitePageMetadata, right: SitePageMetadata): number {
  const leftNavOrder = left.navOrder ?? Number.POSITIVE_INFINITY;
  const rightNavOrder = right.navOrder ?? Number.POSITIVE_INFINITY;
  const navOrderDifference = leftNavOrder - rightNavOrder;
  if (navOrderDifference !== 0) {
    return navOrderDifference;
  }

  return compareSitePageMetadata(left, right);
}

function listSitePageEntries(directoryPath: string): fs.Dirent[] {
  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function listRelativeMdxFilePathsRecursively(
  directoryPath: string,
  relativeDirectoryPath = "",
): string[] {
  const mdxFilePaths: string[] = [];

  for (const entry of listSitePageEntries(directoryPath)) {
    const absoluteEntryPath = path.join(directoryPath, entry.name);
    const relativeEntryPath = relativeDirectoryPath
      ? path.posix.join(relativeDirectoryPath, entry.name)
      : entry.name;

    if (entry.isDirectory()) {
      mdxFilePaths.push(
        ...listRelativeMdxFilePathsRecursively(absoluteEntryPath, relativeEntryPath),
      );
      continue;
    }

    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== MDX_EXTENSION) {
      continue;
    }

    mdxFilePaths.push(relativeEntryPath);
  }

  return mdxFilePaths;
}

function listAllSitePageRelativeFilePaths(): string[] {
  if (!fs.existsSync(SITE_PAGES_ROOT_DIRECTORY)) {
    return [];
  }

  if (!fs.statSync(SITE_PAGES_ROOT_DIRECTORY).isDirectory()) {
    return [];
  }

  return listRelativeMdxFilePathsRecursively(SITE_PAGES_ROOT_DIRECTORY);
}

function readSitePageDocument(relativeFilePath: string): SitePageDocument {
  const filePath = path.join(SITE_PAGES_ROOT_DIRECTORY, relativeFilePath);
  const source = fs.readFileSync(filePath, "utf8");
  const parsedSource = matter(source);

  return {
    metadata: parseSitePageMetadataFromFilePath(parsedSource.data, relativeFilePath),
    content: parsedSource.content,
    filePath,
  };
}

function listAllSitePageDocuments(): SitePageDocument[] {
  const pages = listAllSitePageRelativeFilePaths().map(readSitePageDocument);
  const filePathByPathname = new Map<string, string>();

  for (const page of pages) {
    const existingFilePath = filePathByPathname.get(page.metadata.pathname);
    if (existingFilePath) {
      throw new Error(
        `Duplicate site page pathname "${page.metadata.pathname}" found in "${existingFilePath}" and "${page.filePath}".`,
      );
    }

    filePathByPathname.set(page.metadata.pathname, page.filePath);
  }

  return pages.sort((left, right) => compareSitePageMetadata(left.metadata, right.metadata));
}

function normalizeRouteLookupSegments(routeSegments: readonly string[]): string[] | null {
  if (!Array.isArray(routeSegments)) {
    return null;
  }

  try {
    return normalizeSitePageRouteSegments(routeSegments);
  } catch {
    return null;
  }
}

export function listAllSitePagesMetadata(): SitePageMetadata[] {
  return listAllSitePageDocuments().map((page) => page.metadata);
}

export function getSitePageByRouteSegments(segments: string[]): SitePageDocument | null {
  const normalizedSegments = normalizeRouteLookupSegments(segments);
  if (!normalizedSegments) {
    return null;
  }

  const pathname = normalizeSitePagePathname(normalizedSegments);
  const page = listAllSitePageDocuments().find(
    (sitePage) => sitePage.metadata.pathname === pathname,
  );

  return page ?? null;
}

export function listHeaderNavigationPages(): SitePageMetadata[] {
  return listAllSitePagesMetadata()
    .filter((page) => page.showInHeader === true)
    .sort(compareHeaderNavigationPages);
}
