"use client";

import type {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  MouseEvent,
} from "react";
import { useState } from "react";

type MdxImageWithPopupProps = ComponentPropsWithoutRef<"img">;

export function MdxImageWithPopup({
  src,
  alt = "",
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  "aria-label": ariaLabel,
  ...props
}: MdxImageWithPopupProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imageSrc = typeof src === "string" ? src : "";
  const canOpenPopup = imageSrc.length > 0;
  const altText = alt.trim();
  const openLabel =
    ariaLabel ?? (altText ? `${altText} を拡大表示` : "画像を拡大表示");
  const popupLabel = altText ? `${altText} の拡大画像` : "拡大画像";
  const popupLinkLabel = altText
    ? `${altText} を新しいタブで開く`
    : "画像を新しいタブで開く";

  const handleImageClick = (event: MouseEvent<HTMLImageElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && canOpenPopup) {
      setIsPopupOpen(true);
    }
  };

  const handleImageKeyDown = (event: KeyboardEvent<HTMLImageElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !canOpenPopup) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsPopupOpen(true);
    }
  };

  const mergedClassName = [className, canOpenPopup ? "cursor-zoom-in" : ""]
    .filter(Boolean)
    .join(" ");

  const handleBackdropClick = () => {
    setIsPopupOpen(false);
  };

  const handlePopupContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <>
      <img
        {...props}
        src={src}
        alt={alt}
        className={mergedClassName || undefined}
        onClick={canOpenPopup ? handleImageClick : onClick}
        onKeyDown={canOpenPopup ? handleImageKeyDown : onKeyDown}
        role={canOpenPopup ? "button" : role}
        tabIndex={canOpenPopup ? 0 : tabIndex}
        aria-label={canOpenPopup ? openLabel : ariaLabel}
      />

      {isPopupOpen && canOpenPopup ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-4"
          role="dialog"
          aria-modal="true"
          aria-label={popupLabel}
          onClick={handleBackdropClick}
        >
          <div
            className="flex max-h-full max-w-full flex-col gap-3"
            onClick={handlePopupContentClick}
          >
            <button
              type="button"
              className="self-end border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm"
              onClick={() => setIsPopupOpen(false)}
              aria-label="拡大画像を閉じる"
            >
              閉じる
            </button>

            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={popupLinkLabel}
            >
              <img
                src={imageSrc}
                alt={alt}
                className="max-h-[80vh] max-w-[90vw] border border-[var(--border)] bg-[var(--surface)]"
              />
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
