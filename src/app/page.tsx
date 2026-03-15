"use client";

import { useState } from "react";
import { ImageModal } from "@/components/ImageModal";
import { RobotGallery } from "@/components/RobotGallery";
import { SocialBannerList } from "@/components/SocialBannerList";
import { robots } from "@/content/robots";
import { socialLinks } from "@/content/socialLinks";
import type { Robot } from "@/types/content";

export default function Page() {
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);

  return (
    <>
      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold">
            参加したロボコン
          </h2>
          <RobotGallery robots={robots} onSelectRobot={setSelectedRobot} />
        </section>

        <section className="space-y-4">
          <h2 className="border-b border-[var(--border)] pb-2 text-xl font-semibold">
            SNS / Site
          </h2>
          <SocialBannerList links={socialLinks} />
        </section>
      </div>

      <ImageModal robot={selectedRobot} onClose={() => setSelectedRobot(null)} />
    </>
  );
}
