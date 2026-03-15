import { useEffect } from "react";
import type { Robot } from "@/types/content";

type ImageModalProps = {
  robot: Robot | null;
  onClose: () => void;
};

export function ImageModal({ robot, onClose }: ImageModalProps) {
  useEffect(() => {
    if (!robot) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [robot, onClose]);

  if (!robot) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${robot.name} の拡大画像`}
      className="fixed inset-0 z-50 bg-[var(--overlay)] p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full max-w-5xl flex-col border border-[var(--border)] bg-[var(--surface)] p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">{robot.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="border border-[var(--border)] px-3 py-1 text-sm"
          >
            閉じる
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto border border-[var(--border)] bg-[var(--surface-muted)] p-2">
          <img
            src={robot.imagePath}
            alt={robot.imageAlt}
            className="h-auto w-full object-contain"
          />
        </div>

        <p className="mt-3 text-sm text-[var(--text-subtle)]">
          {robot.description}
        </p>
      </div>
    </div>
  );
}
