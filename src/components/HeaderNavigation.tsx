"use client";

import { useId, useState } from "react";

export type HeaderNavigationItem = {
  readonly pathname: string;
  readonly label: string;
};

type HeaderNavigationProps = {
  readonly siteTitle: string;
  readonly items: readonly HeaderNavigationItem[];
};

export function HeaderNavigation({ siteTitle, items }: HeaderNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const hasNavigationItems = items.length > 0;

  return (
    <div className="space-y-4 sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <a href="/">{siteTitle}</a>
        </h1>

        {hasNavigationItems ? (
          <button
            type="button"
            className="border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm sm:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={
              isMobileMenuOpen
                ? "Close primary navigation menu"
                : "Open primary navigation menu"
            }
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{isMobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        ) : null}
      </div>

      <nav aria-label="Primary navigation" className="sm:flex-1 sm:justify-end">
        {hasNavigationItems ? (
          <>
            <ul className="hidden items-center justify-end gap-4 text-sm sm:flex">
              {items.map((item) => (
                <li key={item.pathname}>
                  <a href={item.pathname}>{item.label}</a>
                </li>
              ))}
            </ul>

            <ul
              id={mobileMenuId}
              className="space-y-2 border-t border-[var(--border)] pt-3 text-sm sm:hidden"
              hidden={!isMobileMenuOpen}
            >
              {items.map((item) => (
                <li key={item.pathname}>
                  <a href={item.pathname} onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </nav>
    </div>
  );
}
