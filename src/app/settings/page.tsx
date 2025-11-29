"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { Camera, Loader2, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    website: "",
    twitter_username: "",
    github_username: "",
    linkedin_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        website: profile.website || "",
        twitter_username: profile.twitter_username || "",
        github_username: profile.github_username || "",
        linkedin_url: profile.linkedin_url || "",
      });
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be less than 5MB" });
      return;
    }

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = user.id + "-" + Date.now() + "." + fileExt;
      const filePath = "avatars/" + fileName;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: "Profile picture updated!" });
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      setMessage({ type: "error", text: error.message || "Failed to upload avatar" });
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
    }

    setIsLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) return null;

  return (
    <AppShell>
      <section className="py-12">
        <Container size="md">
          <h1 className="text-3xl font-bold text-[#FAFAFA] mb-8">Settings</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar
                      src={avatarUrl}
                      fallback={formData.full_name || formData.username || user.email}
                      size="xl"
                      className="w-24 h-24"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#A1A1A1] mb-2">
                      Click on the avatar to upload a new profile picture.
                    </p>
                    <p className="text-xs text-[#737373]">
                      Recommended: Square image, at least 200x200px. Max 5MB.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? "Uploading..." : "Change Picture"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Your name"
                  />
                  <Input
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="username"
                  />
                </div>
                <Textarea
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourwebsite.com"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Twitter"
                    value={formData.twitter_username}
                    onChange={(e) => setFormData({ ...formData, twitter_username: e.target.value })}
                    placeholder="@username"
                  />
                  <Input
                    label="GitHub"
                    value={formData.github_username}
                    onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                    placeholder="username"
                  />
                </div>
                <Input
                  label="LinkedIn"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </CardContent>
            </Card>

            {message && (
              <p className={"text-sm " + (message.type === "success" ? "text-[#22C55E]" : "text-[#E53935]")}>
                {message.text}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>

          {/* Logout Section */}
          <div className="mt-12 pt-8 border-t border-[#262626]">
            <Card className="border-[#E53935]/20 bg-[#E53935]/5">
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <h3 className="text-sm font-medium text-[#FAFAFA]">Log out of your account</h3>
                  <p className="text-xs text-[#737373] mt-0.5">You will need to sign in again to access your account.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-[#E53935]/50 text-[#E53935] hover:bg-[#E53935]/10 hover:border-[#E53935]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </AppShell>
  );
}
