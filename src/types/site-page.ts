export type SitePageFrontmatter = {
  title: string;
  description?: string;
  navLabel?: string;
  showInHeader?: boolean;
  navOrder?: number;
};

export type SitePageMetadata = SitePageFrontmatter & {
  routeSegments: string[];
  pathname: string;
};
