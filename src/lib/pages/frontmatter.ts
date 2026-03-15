import type { SitePageFrontmatter, SitePageMetadata } from "@/types/site-page";

type FrontmatterRecord = Record<string, unknown>;

const INDEX_FILE_BASENAME = "index";
const MDX_EXTENSION = ".mdx";

function assertFrontmatterRecord(value: unknown): FrontmatterRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Site page frontmatter must be an object.");
  }

  return value as FrontmatterRecord;
}

function normalizeRequiredString(
  value: unknown,
  fieldName: keyof SitePageFrontmatter,
): string {
  if (typeof value !== "string") {
    throw new Error(`Site page frontmatter "${fieldName}" must be a string.`);
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    throw new Error(`Site page frontmatter "${fieldName}" cannot be empty.`);
  }

  return normalizedValue;
}

function normalizeOptionalString(
  value: unknown,
  fieldName: keyof SitePageFrontmatter,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`Site page frontmatter "${fieldName}" must be a string.`);
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return undefined;
  }

  return normalizedValue;
}

function normalizeOptionalBoolean(
  value: unknown,
  fieldName: keyof SitePageFrontmatter,
): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Site page frontmatter "${fieldName}" must be a boolean.`);
  }

  return value;
}

function normalizeOptionalNumber(
  value: unknown,
  fieldName: keyof SitePageFrontmatter,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Site page frontmatter "${fieldName}" must be a finite number.`);
  }

  return value;
}

export function normalizeSitePageRouteSegment(segment: string): string {
  const normalizedSegment = segment.trim();
  if (!normalizedSegment) {
    throw new Error("Site page route segment cannot be empty.");
  }

  if (normalizedSegment === "." || normalizedSegment === "..") {
    throw new Error('Site page route segment cannot be "." or "..".');
  }

  if (normalizedSegment.includes("/") || normalizedSegment.includes("\\")) {
    throw new Error('Site page route segment cannot include "/" or "\\".');
  }

  return normalizedSegment;
}

export function normalizeSitePageRouteSegments(routeSegments: readonly string[]): string[] {
  return routeSegments.map((segment, index) => {
    if (typeof segment !== "string") {
      throw new Error(`Site page route segment at index ${index} must be a string.`);
    }

    try {
      return normalizeSitePageRouteSegment(segment);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid site page route segment.";
      throw new Error(`Invalid site page route segment at index ${index}: ${message}`);
    }
  });
}

export function normalizeSitePagePathname(routeSegments: readonly string[]): string {
  const normalizedRouteSegments = normalizeSitePageRouteSegments(routeSegments);

  return normalizedRouteSegments.length === 0
    ? "/"
    : `/${normalizedRouteSegments.join("/")}`;
}

export function filePathToSitePageRouteSegments(relativeMdxFilePath: string): string[] {
  if (typeof relativeMdxFilePath !== "string") {
    throw new Error("Site page file path must be a string.");
  }

  const normalizedFilePath = relativeMdxFilePath.trim();
  if (!normalizedFilePath) {
    throw new Error("Site page file path cannot be empty.");
  }

  if (normalizedFilePath.includes("\\")) {
    throw new Error('Site page file path cannot include "\\".');
  }

  if (normalizedFilePath.startsWith("/")) {
    throw new Error("Site page file path must be relative to content/pages.");
  }

  const pathSegments = normalizedFilePath.split("/");
  if (pathSegments.some((segment) => segment.length === 0)) {
    throw new Error("Site page file path cannot contain empty path segments.");
  }

  const fileName = pathSegments[pathSegments.length - 1];
  if (!fileName.toLowerCase().endsWith(MDX_EXTENSION)) {
    throw new Error(`Site page file path must end with "${MDX_EXTENSION}".`);
  }

  const fileBaseName = fileName.slice(0, -MDX_EXTENSION.length);
  const routeSegments = pathSegments.slice(0, -1);

  if (fileBaseName !== INDEX_FILE_BASENAME) {
    routeSegments.push(fileBaseName);
  }

  return normalizeSitePageRouteSegments(routeSegments);
}

export function parseSitePageFrontmatter(rawFrontmatter: unknown): SitePageFrontmatter {
  const frontmatter = assertFrontmatterRecord(rawFrontmatter);
  const description = normalizeOptionalString(frontmatter.description, "description");
  const navLabel = normalizeOptionalString(frontmatter.navLabel, "navLabel");
  const showInHeader = normalizeOptionalBoolean(frontmatter.showInHeader, "showInHeader");
  const navOrder = normalizeOptionalNumber(frontmatter.navOrder, "navOrder");

  return {
    title: normalizeRequiredString(frontmatter.title, "title"),
    ...(description === undefined ? {} : { description }),
    ...(navLabel === undefined ? {} : { navLabel }),
    ...(showInHeader === undefined ? {} : { showInHeader }),
    ...(navOrder === undefined ? {} : { navOrder }),
  };
}

export function normalizeSitePageMetadata(
  frontmatter: SitePageFrontmatter,
  routeSegments: readonly string[],
): SitePageMetadata {
  const normalizedFrontmatter = parseSitePageFrontmatter(frontmatter);
  const normalizedRouteSegments = normalizeSitePageRouteSegments(routeSegments);

  return {
    ...normalizedFrontmatter,
    routeSegments: normalizedRouteSegments,
    pathname: normalizeSitePagePathname(normalizedRouteSegments),
  };
}

export function parseSitePageMetadata(
  rawFrontmatter: unknown,
  routeSegments: readonly string[],
): SitePageMetadata {
  return normalizeSitePageMetadata(
    parseSitePageFrontmatter(rawFrontmatter),
    routeSegments,
  );
}

export function parseSitePageMetadataFromFilePath(
  rawFrontmatter: unknown,
  relativeMdxFilePath: string,
): SitePageMetadata {
  return parseSitePageMetadata(
    rawFrontmatter,
    filePathToSitePageRouteSegments(relativeMdxFilePath),
  );
}
