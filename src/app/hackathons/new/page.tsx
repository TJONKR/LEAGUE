"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/ui/container";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Globe, MapPin } from "lucide-react";
import Link from "next/link";

export default function NewHackathonPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !profile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const maxParticipants = formData.get("maxParticipants") as string;

    try {
      const slug = slugify(title) + "-" + Date.now().toString(36);

      const { data, error: insertError } = await supabase
        .from("hackathons")
        .insert({
          title,
          slug,
          description: description || null,
          location: isOnline ? null : location,
          is_online: isOnline,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          max_participants: maxParticipants ? parseInt(maxParticipants) : null,
          organizer_id: profile.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Auto-join as organizer
      await supabase.from("hackathon_participants").insert({
        hackathon_id: data.id,
        user_id: profile.id,
        role: "organizer",
      });

      router.push(`/hackathons/${data.slug}`);
    } catch (err) {
      console.error("Error creating hackathon:", err);
      setError("Failed to create hackathon. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <AppShell>
      <Container size="md" className="py-8">
        <Link
          href="/hackathons"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hackathons
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create Hackathon</CardTitle>
            <CardDescription>
              Host your own hackathon and bring builders together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                name="title"
                label="Hackathon Name"
                placeholder="My Awesome Hackathon"
                required
              />

              <Textarea
                name="description"
                label="Description"
                placeholder="Tell participants what your hackathon is about..."
                rows={4}
              />

              {/* Location Type Toggle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Location Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOnline(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      !isOnline
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground-muted hover:border-border-hover"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    In-Person
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOnline(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      isOnline
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground-muted hover:border-border-hover"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    Online
                  </button>
                </div>
              </div>

              {!isOnline && (
                <Input
                  name="location"
                  label="Location"
                  placeholder="Amsterdam, Netherlands"
                />
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="startDate"
                  label="Start Date & Time"
                  type="datetime-local"
                  required
                />
                <Input
                  name="endDate"
                  label="End Date & Time"
                  type="datetime-local"
                  required
                />
              </div>

              <Input
                name="maxParticipants"
                label="Max Participants"
                type="number"
                placeholder="Leave empty for unlimited"
                min={1}
              />

              {error && (
                <p className="text-sm text-error">{error}</p>
              )}

              <div className="flex gap-3 pt-4">
                <Link href="/hackathons" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" isLoading={isLoading}>
                  Create Hackathon
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </AppShell>
  );
}





