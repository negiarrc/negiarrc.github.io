import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: "__negi__",
    template: "%s | __negi__",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
          <header className="border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="mx-auto w-full max-w-6xl px-4 py-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold sm:text-3xl">__negi__</h1>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            {children}
          </main>

          <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
            <div className="mx-auto w-full max-w-6xl px-4 py-4 text-sm text-[var(--text-subtle)]">
              © {currentYear} __negi__
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
