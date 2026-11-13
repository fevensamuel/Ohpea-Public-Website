// All fallback data removed. The app relies on the real API.
// If the API fails, pages show honest empty states.

export const fallbackStats = {
  totalMembers: 0,
  accreditedHotels: 0,
  certifiedGuides: 0,
  trainingGraduates: 0,
};

export const fallbackSiteSettings = {
  name: 'OHPEA',
  tagline: 'Oromia Hospitality & Tourism Professionals Association',
  email: 'info@ohpea.org',
  phone: '+251 11 550 4422',
  address: 'Finfinnee, Oromia, Ethiopia',
};

export const fallbackLookups = {
  regions: [] as any[],
  sectors: [] as any[],
  graduationLevels: [] as any[],
  fieldsOfStudy: [] as any[],
  occupationTypes: [] as any[],
};

export const fallbackObjectives: any[] = [];
export const fallbackPartners: any[] = [];
export const fallbackAnnouncements: any[] = [];
export const fallbackActivities: any[] = [];
export const fallbackPrograms: any[] = [];