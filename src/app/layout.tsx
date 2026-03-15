import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import { socialLinks } from "@/content/socialLinks";
import { listHeaderNavigationPages } from "@/lib/pages/loader";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL("https://negiarrc.github.io"),
  title: {
    default: "__negi__",
    template: "%s | __negi__",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  const currentYear = new Date().getFullYear();
  const footerBannerLinks = socialLinks.filter((link) => link.showInBanner);
  const headerNavigationItems = listHeaderNavigationPages().map((page) => ({
    pathname: page.pathname,
    label: page.navLabel ?? page.title,
  }));

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
          <header className="border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="mx-auto w-full max-w-6xl px-4 py-6">
              <HeaderNavigation siteTitle="__negi__" items={headerNavigationItems} />
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            {children}
          </main>

          <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="mx-auto w-full max-w-6xl px-4 py-4 text-sm text-[var(--text-subtle)]">
              <p>© {currentYear} negi_arrc all rights reserved.</p>

              <nav
                aria-label="Footer social links"
                className="mt-2 flex flex-wrap items-center"
              >
                {footerBannerLinks.map((link, index) => (
                  <span key={link.id} className="inline-flex items-center">
                    {index > 0 && <span className="mx-2">|</span>}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      {link.name}
                    </a>
                  </span>
                ))}
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
