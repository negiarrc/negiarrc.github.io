import type { SocialLink } from "@/types/content";

type SocialBannerListProps = {
  links: SocialLink[];
};

export function SocialBannerList({ links }: SocialBannerListProps) {
  const bannerLinks = links.filter((link) => link.showInBanner);

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {bannerLinks.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-hover)] no-underline"
          >
            <p className="text-sm text-[var(--text-subtle)]">{link.name}</p>
            <p className="mt-1 text-base font-semibold">{link.handle}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}
