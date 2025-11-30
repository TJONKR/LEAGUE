import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { isValidUrl } from "@/lib/utils/url";
import { Heart, Github, ExternalLink, Folder } from "lucide-react";
import type { Project, Profile, Hackathon } from "@/types/database";

interface ProjectCardProps {
  project: Project & {
    creator: Profile;
    hackathon?: Hackathon | null;
  };
  compact?: boolean;
}

export function ProjectCard({ project, compact }: ProjectCardProps) {
  if (compact) {
    return (
      <Link href={`/projects/${project.slug}`}>
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1C1C1C] transition-colors group">
          {/* Thumbnail */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1C1C1C]">
            {isValidUrl(project.cover_image) ? (
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E53935]/20 to-[#E53935]/5">
                <Folder className="w-5 h-5 text-[#E53935]/50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[#FAFAFA] truncate group-hover:text-[#E53935] transition-colors">
              {project.title}
            </h4>
            <p className="text-sm text-[#737373] truncate">
              by {project.creator.full_name || project.creator.username}
            </p>
          </div>

          {/* Votes */}
          <div className="flex items-center gap-1 text-[#737373]">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{project.vote_count}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${project.slug}`}>
      <Card hover className="h-full">
        {/* Cover Image */}
        <div className="relative h-40 bg-[#1C1C1C]">
          {isValidUrl(project.cover_image) ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E53935]/20 via-[#111111] to-[#0A0A0A]">
              <Folder className="w-12 h-12 text-[#E53935]/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-[#FAFAFA] truncate group-hover:text-[#E53935] transition-colors">
              {project.title}
            </h3>
            <div className="flex items-center gap-1 text-[#737373] flex-shrink-0">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{project.vote_count}</span>
            </div>
          </div>

          {project.description && (
            <p className="text-sm text-[#A1A1A1] line-clamp-2 mb-3">
              {project.description}
            </p>
          )}

          {/* Creator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar
                src={project.creator.altered_avatar_url || project.creator.avatar_url || project.creator.fetched_url}
                fallback={project.creator.full_name || project.creator.username}
                size="xs"
              />
              <span className="text-sm text-[#737373] truncate">
                {project.creator.full_name || project.creator.username}
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-2">
              {project.github_url && (
                <Github className="w-4 h-4 text-[#737373]" />
              )}
              {project.demo_url && (
                <ExternalLink className="w-4 h-4 text-[#737373]" />
              )}
            </div>
          </div>

          {/* Hackathon Badge */}
          {project.hackathon && (
            <Badge variant="outline" size="sm" className="mt-3">
              {project.hackathon.title}
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}



