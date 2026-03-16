// Enum types
export type UserRole = 'researcher' | 'municipal_partner' | 'designer' | 'admin';
export type Institution =
  | 'OsloMet'
  | 'UiO'
  | 'Durham'
  | 'Comte Bureau'
  | 'Alna District'
  | 'Søndre Nordstrand'
  | 'Skien Municipality';
export type WorkPackage = 'WP1' | 'WP2' | 'WP3' | 'WP4';
export type FieldSite = 'Alna' | 'Søndre Nordstrand' | 'Skien';
export type MaterialType =
  | 'fieldnote'
  | 'photo'
  | 'sketch'
  | 'map'
  | 'transcript'
  | 'case_study'
  | 'policy_doc'
  | 'workshop_output'
  | 'prototype_doc';
export type ChallengeStatus =
  | 'mapping'
  | 'ideation'
  | 'prototyping'
  | 'testing'
  | 'implementing';

// Row types
export interface Profile {
  id: string;
  full_name: string | null;
  institution: Institution | null;
  role: UserRole | null;
  work_packages: WorkPackage[] | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: string;
  title: string;
  body: string;
  author_id: string;
  work_package: WorkPackage | null;
  field_site: FieldSite | null;
  material_type: MaterialType | null;
  tags: string[] | null;
  flagged_for_design: boolean;
  flagged_by: string | null;
  flagged_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  status: ChallengeStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  body: string;
  author_id: string;
  insight_id: string | null;
  challenge_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  insight_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  uploaded_by: string;
  created_at: string;
}

export interface ChallengeInsight {
  challenge_id: string;
  insight_id: string;
  linked_by: string;
  linked_at: string;
}

export interface ChallengeParticipant {
  challenge_id: string;
  user_id: string;
  joined_at: string;
}

export interface ChallengeTransition {
  id: string;
  challenge_id: string;
  from_status: ChallengeStatus | null;
  to_status: ChallengeStatus;
  summary: string;
  transitioned_by: string;
  created_at: string;
}

export interface ChallengeTransitionWithAuthor extends ChallengeTransition {
  author_name: string | null;
}

// Insert types (omit auto-generated fields)
export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type InsightInsert = Omit<Insight, 'id' | 'created_at' | 'updated_at'>;
export type ChallengeInsert = Omit<Challenge, 'id' | 'created_at' | 'updated_at'>;
export type CommentInsert = Omit<Comment, 'id' | 'created_at' | 'updated_at'>;

// View/enriched types
export interface InsightWithDetails extends Insight {
  author_name: string | null;
  author_institution: Institution | null;
  comment_count: number;
  attachment_count: number;
}

export interface ChallengeWithDetails extends Challenge {
  creator_name: string | null;
  creator_institution: Institution | null;
  participant_count: number;
  insight_count: number;
  comment_count: number;
  transition_count: number;
}

export interface CommentWithAuthor extends Comment {
  author_name: string | null;
  author_institution: Institution | null;
}
