export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          hackathon_id: string | null
          id: string
          points: number
          type: Database["public"]["Enums"]["achievement_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hackathon_id?: string | null
          id?: string
          points: number
          type: Database["public"]["Enums"]["achievement_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          hackathon_id?: string | null
          id?: string
          points?: number
          type?: Database["public"]["Enums"]["achievement_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathon_participants: {
        Row: {
          hackathon_id: string
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["participant_role"] | null
          user_id: string
        }
        Insert: {
          hackathon_id: string
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["participant_role"] | null
          user_id: string
        }
        Update: {
          hackathon_id?: string
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["participant_role"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hackathon_participants_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hackathon_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hackathons: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          is_online: boolean | null
          location: string | null
          max_participants: number | null
          organizer_id: string
          registration_deadline: string | null
          slug: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_online?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id: string
          registration_deadline?: string | null
          slug: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_online?: boolean | null
          location?: string | null
          max_participants?: number | null
          organizer_id?: string
          registration_deadline?: string | null
          slug?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hackathons_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          github_username: string | null
          id: string
          linkedin_url: string | null
          total_score: number | null
          twitter_username: string | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_username?: string | null
          id: string
          linkedin_url?: string | null
          total_score?: number | null
          twitter_username?: string | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_username?: string | null
          id?: string
          linkedin_url?: string | null
          total_score?: number | null
          twitter_username?: string | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_votes: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_votes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_image: string | null
          created_at: string | null
          creator_id: string
          demo_url: string | null
          description: string | null
          github_url: string | null
          hackathon_id: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
          vote_count: number | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          creator_id: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          hackathon_id?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          creator_id?: string
          demo_url?: string | null
          description?: string | null
          github_url?: string | null
          hackathon_id?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_hackathon_id_fkey"
            columns: ["hackathon_id"]
            isOneToOne: false
            referencedRelation: "hackathons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      achievement_type:
        | "participation"
        | "submission"
        | "first_place"
        | "second_place"
        | "third_place"
      participant_role: "participant" | "organizer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Hackathon = Database["public"]["Tables"]["hackathons"]["Row"];
export type HackathonParticipant = Database["public"]["Tables"]["hackathon_participants"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectMember = Database["public"]["Tables"]["project_members"]["Row"];
export type ProjectVote = Database["public"]["Tables"]["project_votes"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];

// Extended types with relations
export type HackathonWithOrganizer = Hackathon & {
  organizer: Profile;
};

export type HackathonWithDetails = Hackathon & {
  organizer: Profile;
  participants: (HackathonParticipant & { profile: Profile })[];
  projects: Project[];
};

export type ProjectWithDetails = Project & {
  creator: Profile;
  hackathon: Hackathon | null;
  members: (ProjectMember & { profile: Profile })[];
};

export type ProfileWithStats = Profile & {
  hackathons_count: number;
  projects_count: number;
  achievements: Achievement[];
};

// Bounty types (until bounties table is added to database)
export type BountyStatus = "open" | "in_review" | "awarded" | "completed" | "cancelled";
