import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";
import { isValidUrl } from "@/lib/utils/url";
import { MapPin, Globe, Users, Calendar } from "lucide-react";
import type { Hackathon, Profile, HackathonParticipant } from "@/types/database";

interface HackathonCardProps {
  hackathon: Hackathon & {
    organizer: Profile | null;
    participants?: (HackathonParticipant & { profile: Profile })[];
  };
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const isUpcoming = new Date(hackathon.start_date) > new Date();
  const isOngoing =
    new Date(hackathon.start_date) <= new Date() &&
    new Date(hackathon.end_date) >= new Date();
  const participantCount = hackathon.participants?.length || 0;

  return (
    <Link href={`/hackathons/${hackathon.slug}`}>
      <Card className="group overflow-hidden hover:border-border-hover transition-all duration-200 cursor-pointer">
        <div className="flex gap-4 p-4">
          {/* Cover Image */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-background-hover">
            {isValidUrl(hackathon.cover_image) ? (
              <Image
                src={hackathon.cover_image}
                alt={hackathon.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <Calendar className="w-8 h-8 text-primary/50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {hackathon.title}
              </h3>
              {isUpcoming && (
                <Badge variant="primary" size="sm">
                  Upcoming
                </Badge>
              )}
              {isOngoing && (
                <Badge variant="success" size="sm">
                  Live
                </Badge>
              )}
            </div>

            {/* Organizer */}
            {hackathon.organizer && hackathon.organizer.username && (
              <div className="flex items-center gap-2 mb-2">
                <Avatar
                  src={hackathon.organizer?.altered_avatar_url || hackathon.organizer?.avatar_url || hackathon.organizer?.fetched_url}
                  fallback={hackathon.organizer?.full_name || hackathon.organizer?.username || 'O'}
                  size="xs"
                />
                <span className="text-sm text-foreground-muted truncate">
                  {hackathon.organizer?.full_name || hackathon.organizer?.username}
                </span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-1.5 text-sm text-foreground-muted mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {formatDateShort(hackathon.start_date)} -{" "}
                {formatDateShort(hackathon.end_date)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-foreground-muted mb-3">
              {hackathon.is_online ? (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{hackathon.location || "TBA"}</span>
                </>
              )}
            </div>

            {/* Participants */}
            <div className="flex items-center justify-between">
              {hackathon.participants && hackathon.participants.length > 0 ? (
                <div className="flex items-center gap-2">
                  <AvatarGroup
                    avatars={hackathon.participants.slice(0, 4).map((p) => ({
                      src: p.profile.altered_avatar_url || p.profile.avatar_url || p.profile.fetched_url,
                      fallback: p.profile.full_name || p.profile.username,
                    }))}
                    max={4}
                    size="xs"
                  />
                  <span className="text-xs text-foreground-muted">
                    +{participantCount} going
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
                  <Users className="w-3.5 h-3.5" />
                  <span>Be the first to join</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}




