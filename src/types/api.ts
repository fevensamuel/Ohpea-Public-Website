export interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: ApiMeta;
  error?: string;
  fields?: Record<string, string>;
}

export interface Paginated<T> {
  data: T[];
  meta: ApiMeta;
}

export interface SiteSettings {
  name?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  social?: Record<string, string>;
  socials?: { id: string; platform: string; label: string; url: string; enabled?: boolean; sortOrder?: number }[];
  hotlines?: string[];
  [k: string]: unknown;
}

export interface PublicStats {
  totalMembers: number;
  accreditedHotels: number;
  certifiedGuides: number;
  trainingGraduates: number;
  [k: string]: unknown; // tolerate future extra keys; never assume presence
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  body?: string;
  [k: string]: unknown;
}

export interface Announcement {
  id: string;
  slug: string;
  type: 'news' | 'event' | 'vacancy' | 'proposal' | 'research';
  title: string;
  summary?: string;
  body?: string;
  coverImage?: string;
  eventStartAt?: string;
  deadline?: string;
  publishedAt?: string;
  [k: string]: unknown;
}

export interface Partner {
  id: string;
  name: string;
  website?: string;
  logoUrl?: string;
  [k: string]: unknown;
}

export interface Activity {
  id: string;
  title: string;
  summary?: string;
  date?: string;
  photos?: string[];
  [k: string]: unknown;
}

export interface Region {
  id: string;
  name: string;
  woredas?: { id: string; name: string }[];
}

export interface RegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  qualification?: string;
  fieldOfStudy?: string;
  organization?: string;
  zone?: string;
  idType: 'fayda' | 'passport' | 'kebele' | 'driver';
  idNumber: string;
  idDocument: File;
  credentialDocs?: File[];
}
