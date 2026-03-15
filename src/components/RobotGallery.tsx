import type { Robot } from "@/types/content";

type RobotGalleryProps = {
  robots: Robot[];
  onSelectRobot: (robot: Robot) => void;
};

export function RobotGallery({ robots, onSelectRobot }: RobotGalleryProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {robots.map((robot) => (
        <li key={robot.id}>
          <button
            type="button"
            onClick={() => onSelectRobot(robot)}
            className="w-full border border-[var(--border)] bg-[var(--surface)] p-3 text-left"
            aria-label={`${robot.name} の画像を拡大`}
          >
            <img
              src={robot.imagePath}
              alt={robot.imageAlt}
              className="aspect-[4/3] w-full border border-[var(--border)] object-cover"
            />
            <p className="mt-3 text-xs text-[var(--text-subtle)]">
              {robot.year}
            </p>
            <h3 className="mt-1 text-base font-semibold">{robot.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-subtle)]">
              {robot.role}
            </p>
            <p className="mt-3 text-sm text-[var(--text-subtle)]">
              {robot.description}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
