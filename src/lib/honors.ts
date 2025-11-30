import type { HonorType } from "@/types/database";

// Honor type metadata for UI display - kept separate for client bundling
export const HONOR_METADATA: Record<HonorType, { label: string; emoji: string; description: string; color: string }> = {
  great_teammate: {
    label: "Great Teammate",
    emoji: "🤝",
    description: "Amazing collaboration and teamwork",
    color: "#3B82F6", // blue
  },
  problem_solver: {
    label: "Problem Solver",
    emoji: "🧠",
    description: "Tackled tough technical challenges",
    color: "#8B5CF6", // purple
  },
  creative_genius: {
    label: "Creative Genius",
    emoji: "💡",
    description: "Brought innovative ideas to the table",
    color: "#F59E0B", // amber
  },
  clutch_player: {
    label: "Clutch Player",
    emoji: "⚡",
    description: "Delivered when it mattered most",
    color: "#EF4444", // red
  },
  design_master: {
    label: "Design Master",
    emoji: "🎨",
    description: "Created beautiful and intuitive designs",
    color: "#EC4899", // pink
  },
};


