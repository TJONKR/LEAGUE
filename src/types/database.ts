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
      bounties: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          reward_amount: number
          deadline: string
          status: Database["public"]["Enums"]["bounty_status"]
          tags: string[] | null
          cover_image: string | null
          poster_id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          reward_amount: number
          deadline: string
          status?: Database["public"]["Enums"]["bounty_status"]
          tags?: string[] | null
          cover_image?: string | null
          poster_id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          reward_amount?: number
          deadline?: string
          status?: Database["public"]["Enums"]["bounty_status"]
          tags?: string[] | null
          cover_image?: string | null
          poster_id?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bounties_poster_id_fkey"
            columns: ["poster_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bounty_submissions: {
        Row: {
          id: string
          bounty_id: string
          project_id: string
          submitted_by: string
          submitted_at: string | null
          is_winner: boolean
        }
        Insert: {
          id?: string
          bounty_id: string
          project_id: string
          submitted_by: string
          submitted_at?: string | null
          is_winner?: boolean
        }
        Update: {
          id?: string
          bounty_id?: string
          project_id?: string
          submitted_by?: string
          submitted_at?: string | null
          is_winner?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "bounty_submissions_bounty_id_fkey"
            columns: ["bounty_id"]
            isOneToOne: false
            referencedRelation: "bounties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bounty_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bounty_submissions_submitted_by_fkey"
            columns: ["submitted_by"]
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
      peer_honors: {
        Row: {
          id: string
          giver_id: string
          receiver_id: string
          project_id: string
          honor_type: Database["public"]["Enums"]["honor_type"]
          points: number
          created_at: string | null
        }
        Insert: {
          id?: string
          giver_id: string
          receiver_id: string
          project_id: string
          honor_type: Database["public"]["Enums"]["honor_type"]
          points?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          giver_id?: string
          receiver_id?: string
          project_id?: string
          honor_type?: Database["public"]["Enums"]["honor_type"]
          points?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peer_honors_giver_id_fkey"
            columns: ["giver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peer_honors_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "peer_honors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          altered_avatar_url: string | null
          auth_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          fetched_url: string | null
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
          altered_avatar_url?: string | null
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          fetched_url?: string | null
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
          altered_avatar_url?: string | null
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          fetched_url?: string | null
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
          bounty_id: string | null
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
          bounty_id?: string | null
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
          bounty_id?: string | null
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
            foreignKeyName: "projects_bounty_id_fkey"
            columns: ["bounty_id"]
            isOneToOne: false
            referencedRelation: "bounties"
            referencedColumns: ["id"]
          },
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
      bounty_status: "open" | "in_review" | "awarded" | "completed" | "cancelled"
      honor_type:
        | "great_teammate"
        | "problem_solver"
        | "creative_genius"
        | "clutch_player"
        | "design_master"
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
export type Bounty = Database["public"]["Tables"]["bounties"]["Row"];
export type BountySubmission = Database["public"]["Tables"]["bounty_submissions"]["Row"];
export type PeerHonor = Database["public"]["Tables"]["peer_honors"]["Row"];

// Enum types
export type BountyStatus = Database["public"]["Enums"]["bounty_status"];
export type HonorType = Database["public"]["Enums"]["honor_type"];

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
  bounty: Bounty | null;
  members: (ProjectMember & { profile: Profile })[];
};

export type ProfileWithStats = Profile & {
  hackathons_count: number;
  projects_count: number;
  achievements: Achievement[];
};

export type BountyWithPoster = Bounty & {
  poster: Profile;
};

export type BountyWithDetails = Bounty & {
  poster: Profile;
  submissions: (BountySubmission & { 
    project: Project; 
    submitter: Profile;
  })[];
};

export type PeerHonorWithDetails = PeerHonor & {
  giver: Profile;
  receiver: Profile;
  project: Project;
};
