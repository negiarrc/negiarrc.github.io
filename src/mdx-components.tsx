import type { MDXComponents } from "mdx/types";
import {
  ArticleCardList,
  ArticleTextList,
} from "@/components/TagArticleList";
import {
  ArticleListBlock,
  AllArticlesTextListBlock,
  RoboconArticleCardsBlock,
  SocialBannerBlock,
} from "@/components/SitePageListingBlocks";

export const sharedMdxComponents = {
  ArticleListBlock,
  ArticleCardList,
  ArticleTextList,
  RoboconArticleCardsBlock,
  AllArticlesTextListBlock,
  SocialBannerBlock,
} satisfies MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedMdxComponents,
    ...components,
  };
}
