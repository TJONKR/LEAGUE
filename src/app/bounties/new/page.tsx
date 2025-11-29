"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { slugify } from "@/lib/utils";
import { AlertCircle, X } from "lucide-react";

const SUGGESTED_TAGS = [
  "AI",
  "Web3",
  "Mobile",
  "API",
  "Data",
  "Automation",
  "Design",
  "DevOps",
  "Security",
  "Analytics",
  "Integration",
  "Open Source",
];

export default function NewBountyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_amount: "",
    deadline: "",
    tags: [] as string[],
    customTag: "",
  });

  function handleAddTag(tag: string) {
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, tag], customTag: "" });
    }
  }

  function handleRemoveTag(tag: string) {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setError(null);

    // Validation
    const rewardAmount = parseFloat(formData.reward_amount);
    if (isNaN(rewardAmount) || rewardAmount < 50) {
      setError("Minimum bounty amount is €50");
      return;
    }

    const deadline = new Date(formData.deadline);
    if (deadline <= new Date()) {
      setError("Deadline must be in the future");
      return;
    }

    setIsLoading(true);

    const slug = slugify(formData.title);

    const { data: bounty, error: insertError } = await supabase
      .from("bounties")
      .insert({
        title: formData.title,
        description: formData.description || null,
        reward_amount: rewardAmount,
        deposit_amount: rewardAmount,
        deadline: deadline.toISOString(),
        tags: formData.tags.length > 0 ? formData.tags : null,
        poster_id: user.id,
        slug,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating bounty:", insertError);
      if (insertError.code === "23505") {
        setError("A bounty with this title already exists. Please choose a different title.");
      } else {
        setError("Failed to create bounty. Please try again.");
      }
      setIsLoading(false);
      return;
    }

    router.push(`/bounties/${slug}`);
  }

  if (!user) {
    return (
      <AppShell>
        <section className="py-12">
          <Container size="md">
            <Card className="p-12 text-center">
              <div className="text-5xl mb-4">🔐</div>
              <p className="text-[#FAFAFA] font-medium mb-2">Sign in required</p>
              <p className="text-sm text-[#737373] mb-6">
                You need to be signed in to post a bounty.
              </p>
              <Button onClick={() => router.push("/login")} className="rounded-full">
                Sign In
              </Button>
            </Card>
          </Container>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="py-12">
        <Container size="md">
          <h1 className="text-3xl font-bold text-[#FAFAFA] mb-2">Post a Bounty</h1>
          <p className="text-[#737373] mb-8">
            Describe a problem you want solved and set a reward for the best solution.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Bounty Details</CardTitle>
                <CardDescription>
                  Describe the problem or challenge you want solved.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Build an AI-powered customer support chatbot"
                  required
                />
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the problem in detail. What are the requirements? What does success look like? Include any relevant context or constraints..."
                  rows={8}
                />
              </CardContent>
            </Card>

            {/* Reward & Deadline */}
            <Card>
              <CardHeader>
                <CardTitle>Reward & Timeline</CardTitle>
                <CardDescription>
                  Set the bounty reward and submission deadline.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
                      Reward Amount (EUR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
                        €
                      </span>
                      <input
                        type="number"
                        min="50"
                        step="1"
                        value={formData.reward_amount}
                        onChange={(e) =>
                          setFormData({ ...formData, reward_amount: e.target.value })
                        }
                        placeholder="50"
                        required
                        className="w-full pl-8 pr-4 py-3 bg-[#111111] border border-[#262626] rounded-lg text-[#FAFAFA] placeholder:text-[#525252] focus:outline-none focus:border-[#F59E0B] transition-colors"
                      />
                    </div>
                    <p className="text-xs text-[#737373] mt-1">Minimum €50</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#FAFAFA] mb-2">
                      Submission Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) =>
                        setFormData({ ...formData, deadline: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-[#111111] border border-[#262626] rounded-lg text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                  </div>
                </div>

                {/* Deposit Notice */}
                <div className="p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                  <p className="text-sm text-[#F59E0B]">
                    <strong>Deposit Required:</strong> The reward amount will be held as a deposit.
                    If you cancel the bounty, the deposit will be forfeited.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add up to 5 tags to help people find your bounty.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="primary"
                        className="flex items-center gap-1.5 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3" />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Custom Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.customTag}
                    onChange={(e) =>
                      setFormData({ ...formData, customTag: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(formData.customTag.trim());
                      }
                    }}
                    placeholder="Add a custom tag..."
                    disabled={formData.tags.length >= 5}
                    className="flex-1 px-4 py-2 bg-[#111111] border border-[#262626] rounded-lg text-[#FAFAFA] placeholder:text-[#525252] focus:outline-none focus:border-[#F59E0B] transition-colors text-sm disabled:opacity-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTag(formData.customTag.trim())}
                    disabled={!formData.customTag.trim() || formData.tags.length >= 5}
                  >
                    Add
                  </Button>
                </div>

                {/* Suggested Tags */}
                <div>
                  <p className="text-xs text-[#737373] mb-2">Suggested:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.filter((tag) => !formData.tags.includes(tag)).map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          disabled={formData.tags.length >= 5}
                          className="px-3 py-1 text-xs bg-[#1A1A1A] text-[#737373] rounded-full hover:bg-[#262626] hover:text-[#FAFAFA] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-black"
              >
                Post Bounty
              </Button>
            </div>
          </form>
        </Container>
      </section>
    </AppShell>
  );
}

