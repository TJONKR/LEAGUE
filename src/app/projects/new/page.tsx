"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/ui/container";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Hackathon } from "@/types/database";

function NewProjectForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get("hackathon");
  const { user, profile } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    async function fetchHackathons() {
      const { data } = await supabase
        .from("hackathons")
        .select("*")
        .order("start_date", { ascending: false });
      if (data) setHackathons(data);
    }
    fetchHackathons();
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  }

  function removeImage() {
    setCoverImage(null);
    setCoverPreview(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !profile) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const demoUrl = formData.get("demoUrl") as string;
    const selectedHackathon = formData.get("hackathon") as string;

    try {
      let coverImageUrl = null;

      // Upload cover image if provided
      if (coverImage) {
        const fileExt = coverImage.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, coverImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        coverImageUrl = urlData.publicUrl;
      }

      const slug = slugify(title) + "-" + Date.now().toString(36);

      const { data, error: insertError } = await supabase
        .from("projects")
        .insert({
          title,
          slug,
          description: description || null,
          cover_image: coverImageUrl,
          github_url: githubUrl || null,
          demo_url: demoUrl || null,
          hackathon_id: selectedHackathon || null,
          creator_id: profile.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/projects/${data.slug}`);
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Failed to create project. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Project</CardTitle>
        <CardDescription>
          Share what you&apos;ve built with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Cover Image
            </label>
            {coverPreview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-background-elevated">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed border-border hover:border-border-hover cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-foreground-muted mb-2" />
                <span className="text-sm text-foreground-muted">
                  Click to upload cover image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <Input
            name="title"
            label="Project Name"
            placeholder="My Awesome Project"
            required
          />

          <Textarea
            name="description"
            label="Description"
            placeholder="What does your project do?"
            rows={4}
          />

          <Input
            name="githubUrl"
            label="GitHub URL"
            placeholder="https://github.com/username/repo"
            type="url"
          />

          <Input
            name="demoUrl"
            label="Demo URL"
            placeholder="https://myproject.com"
            type="url"
          />

          {/* Hackathon Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Hackathon (Optional)
            </label>
            <select
              name="hackathon"
              defaultValue={hackathonId || ""}
              className="w-full h-10 px-3 rounded-lg bg-background-elevated border border-border text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Not part of a hackathon</option>
              {hackathons.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-foreground-muted">
              Link this project to a hackathon you participated in
            </p>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex gap-3 pt-4">
            <Link href="/projects" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Submit Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function FormLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-foreground-muted" />
      </CardContent>
    </Card>
  );
}

export default function NewProjectPage() {
  return (
    <AppShell>
      <Container size="md" className="py-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <Suspense fallback={<FormLoading />}>
          <NewProjectForm />
        </Suspense>
      </Container>
    </AppShell>
  );
}
