"use client";

import { useState } from "react";
import { ImageModal } from "@/components/ImageModal";
import { RobotImageList } from "@/components/TagArticleList";
import { robots } from "@/content/robots";
import type { Robot } from "@/types/content";

export function RobotSection() {
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);

  return (
    <>
      <section className="space-y-4">
        <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold">
          参加したロボコン
        </h2>
        <RobotImageList robots={robots} onSelectRobot={setSelectedRobot} />
      </section>

      <ImageModal
        robot={selectedRobot}
        onClose={() => setSelectedRobot(null)}
      />
    </>
  );
}
