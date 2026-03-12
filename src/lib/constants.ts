import type { WorkPackage, ChallengeStatus, Institution, FieldSite, MaterialType } from './types/database';

export const WP_CONFIG: Record<WorkPackage, { label: string; dot: string; bg: string }> = {
  WP1: { label: 'WP1 — Homes & Communities', dot: '#C45D3E', bg: '#FDF0EC' },
  WP2: { label: 'WP2 — Health & Care', dot: '#3A8A7D', bg: '#E6F3F1' },
  WP3: { label: 'WP3 — Transnational Policies', dot: '#5B6AAF', bg: '#ECEEF7' },
  WP4: { label: 'WP4 — Innovation & Design', dot: '#A08620', bg: '#FFF8E6' },
};

export const STATUS_CONFIG: Record<ChallengeStatus, { label: string; color: string; bg: string }> = {
  mapping: { label: 'Mapping', color: '#5B6AAF', bg: '#ECEEF7' },
  ideation: { label: 'Ideation', color: '#3A8A7D', bg: '#E6F3F1' },
  prototyping: { label: 'Prototyping', color: '#C45D3E', bg: '#FDF0EC' },
  testing: { label: 'Testing', color: '#8B6914', bg: '#FFF8E6' },
  implementing: { label: 'Implementing', color: '#2D6A4F', bg: '#E6F5EC' },
};

export const INSTITUTIONS: Institution[] = [
  'OsloMet',
  'UiO',
  'Durham',
  'Comte Bureau',
  'Alna District',
  'Søndre Nordstrand',
  'Skien Municipality',
];

export const FIELD_SITES: FieldSite[] = ['Alna', 'Søndre Nordstrand', 'Skien'];

export const MATERIAL_TYPES: MaterialType[] = [
  'fieldnote',
  'photo',
  'sketch',
  'map',
  'transcript',
  'case_study',
  'policy_doc',
  'workshop_output',
  'prototype_doc',
];

export const WORK_PACKAGES: WorkPackage[] = ['WP1', 'WP2', 'WP3', 'WP4'];

export const CHALLENGE_STATUSES: ChallengeStatus[] = [
  'mapping',
  'ideation',
  'prototyping',
  'testing',
  'implementing',
];

export const USER_ROLES = ['researcher', 'municipal_partner', 'designer', 'admin'] as const;

export const ROLE_LABELS: Record<string, string> = {
  researcher: 'Researcher',
  municipal_partner: 'Municipal Partner',
  designer: 'Designer',
  admin: 'Admin',
};

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  fieldnote: 'Field Note',
  photo: 'Photo',
  sketch: 'Sketch',
  map: 'Map',
  transcript: 'Transcript',
  case_study: 'Case Study',
  policy_doc: 'Policy Document',
  workshop_output: 'Workshop Output',
  prototype_doc: 'Prototype Document',
};
