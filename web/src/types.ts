/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'om' | 'am' | 'ar' | 'fr';

export interface I18nString {
  en: string;
  om?: string;
  am?: string;
  ar?: string;
  fr?: string;
  [key: string]: string | undefined;
}

export * from './types/api.js';

export interface Program {
  id: string;
  slug: string;
  icon: string;
  title: I18nString;
  summary: I18nString;
  body: I18nString;
  bullets?: I18nString[];
  sortOrder: number;
  isActive: boolean;
  comingSoon?: boolean;
}

export type ObjectiveKind = 'general' | 'main' | 'specific' | 'official';

export interface Objective {
  id: string;
  kind: ObjectiveKind;
  title: I18nString;
  description: I18nString;
  sortOrder: number;
}

export type AnnouncementType = 'news' | 'event' | 'vacancy' | 'call_for_proposal' | 'call_for_research';

export interface Announcement {
  id: string;
  slug: string;
  type: AnnouncementType;
  title: I18nString;
  summary: I18nString;
  body: I18nString;
  attachmentUrl?: string | null;
  externalLink?: string | null;
  organizationName?: string | null;
  location?: string | null;
  deadline?: string | null;
  publishedAt?: string | null;
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  registrationOpen?: boolean;
  registrationUrl?: string | null;
  coverImageUrl?: string | null;
  featured?: boolean;
}

export interface Activity {
  id: string;
  title: I18nString;
  description: I18nString;
  activityDate: string;
  imageUrl: string | null;
  category?: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  sortOrder: number;
}

export interface SiteSettings {
  orgName: I18nString;
  tagline: I18nString;
  mission: I18nString;
  vision: I18nString;
  logoUrl?: string;
  contactPhones: string[];
  contactEmails: string[];
  address: I18nString;
  mapLink: string;
  socialLinks: {
    facebook?: string;
    telegram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  workingHours: string;
}

export interface LookupItem {
  id: string;
  code: string;
  label: I18nString;
  localizedLabel?: string;
}

export interface LookupData {
  regions: LookupItem[];
  sectors: LookupItem[];
  fieldsOfStudy: LookupItem[];
  graduationLevels: LookupItem[];
  occupationTypes: LookupItem[];
}

export interface RegistrationFormData {
  fullName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  graduationLevelId: string;
  occupationType: 'private' | 'government' | 'other';
  sectorId: string;
  fieldOfStudyId: string;
  organizationName?: string;
  jobTitle?: string;
  professionalCategory?: string;
  regionId: string;
  town: string;
  idType: 'fayda' | 'passport';
  idNumber: string;
  idDocument: File | null;
  credentials: File[];
  consent: boolean;
  otpCode?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fields?: Record<string, string>;
}
