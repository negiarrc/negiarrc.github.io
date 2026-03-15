import { socialLinks } from "@/content/socialLinks";
import {
  listAllArticlesMetadata,
  listArticlesMetadataByCategory,
} from "@/lib/articles/loader";
import { SocialBannerList } from "./SocialBannerList";
import { ArticleCardList, ArticleTextList } from "./TagArticleList";

type LegacyListingBlockProps = {
  readonly emptyMessage?: string;
};

type ArticleListVariant = "card" | "text";

export type ArticleListBlockProps = {
  readonly category?: string;
  readonly variant?: ArticleListVariant;
  readonly emptyMessage?: string;
};

function listArticlesByCategory(category?: string) {
  const normalizedCategory = category?.trim();
  if (!normalizedCategory) {
    return listAllArticlesMetadata();
  }

  return listArticlesMetadataByCategory(normalizedCategory);
}

export function ArticleListBlock({
  category,
  variant = "card",
  emptyMessage,
}: ArticleListBlockProps) {
  const articles = listArticlesByCategory(category);

  if (variant === "text") {
    return <ArticleTextList articles={articles} emptyMessage={emptyMessage} />;
  }

  return <ArticleCardList articles={articles} emptyMessage={emptyMessage} />;
}

export function AllArticlesTextListBlock({
  emptyMessage,
}: LegacyListingBlockProps) {
  return (
    <ArticleListBlock
      variant="text"
      emptyMessage={emptyMessage ?? "公開されている記事はまだありません。"}
    />
  );
}

export function SocialBannerBlock() {
  return <SocialBannerList links={socialLinks} />;
}
