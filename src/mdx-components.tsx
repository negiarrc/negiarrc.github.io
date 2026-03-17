import type { MDXComponents } from "mdx/types";
import { ArticleCardList, ArticleTextList } from "@/components/TagArticleList";
import {
  ArticleListBlock,
  AllArticlesTextListBlock,
  SocialBannerBlock,
} from "@/components/SitePageListingBlocks";
import { MdxImageWithPopup } from "@/components/MdxImageWithPopup";

export const sharedMdxComponents = {
  ArticleListBlock,
  ArticleCardList,
  ArticleTextList,
  AllArticlesTextListBlock,
  SocialBannerBlock,
  img: MdxImageWithPopup,
  a: (props) => <a className="underline hover:no-underline" {...props} />,
} satisfies MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...sharedMdxComponents,
    ...components,
  };
}
