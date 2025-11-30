"use client";

import type { LanguageStats } from "@/types/database";

// Language colors based on GitHub's linguist
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  SQL: "#e38c00",
  GraphQL: "#e10098",
  Markdown: "#083fa1",
};

function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || "#8b949e";
}

interface LanguageBarProps {
  languages: LanguageStats;
  showLabels?: boolean;
  className?: string;
}

export function LanguageBar({ languages, showLabels = true, className = "" }: LanguageBarProps) {
  // Sort languages by percentage (highest first)
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Show top 8 languages max

  if (sortedLanguages.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Language bar */}
      <div className="h-2 rounded-full overflow-hidden flex bg-[#262626]">
        {sortedLanguages.map(([language, percentage]) => (
          <div
            key={language}
            className="h-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: getLanguageColor(language),
            }}
            title={`${language}: ${percentage.toFixed(1)}%`}
          />
        ))}
      </div>

      {/* Language labels */}
      {showLabels && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {sortedLanguages.map(([language, percentage]) => (
            <div key={language} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getLanguageColor(language) }}
              />
              <span className="text-[#A1A1A1]">{language}</span>
              <span className="text-[#525252]">{percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

