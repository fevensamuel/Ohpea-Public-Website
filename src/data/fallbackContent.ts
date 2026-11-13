/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Program,
  Objective,
  Partner,
  Announcement,
  Activity,
  LookupData,
  PublicStats,
} from '../types.js';
import { SiteSettings as ApiSiteSettings } from '../lib/ohpea-api-client.js';

export const fallbackStats: PublicStats = {
  totalMembers: 0,
  accreditedHotels: 0,
  certifiedGuides: 0,
  trainingGraduates: 0,
};

export const fallbackSiteSettings: ApiSiteSettings = {
  name: 'OHPEA',
  tagline: 'Oromia Hospitality & Tourism Professionals Association',
  taglineOm: 'Waldaa Ogeeyyii Keessummeessuu fi Tuuriizimii Oromiyaa',
  email: 'info@ohpea.org',
  phone: '+251 11 550 4422',
  address: 'Finfinnee, Oromia, Ethiopia',
};

export const fallbackPrograms: Program[] = [];

export const fallbackObjectives: Objective[] = [];

export const fallbackPartners: Partner[] = [];

export const fallbackAnnouncements: Announcement[] = [];

export const fallbackActivities: Activity[] = [];

export const fallbackLookups: LookupData = {
  regions: [
    { id: 'reg-east-shewa', code: 'east_shewa', label: { en: 'East Shewa Zone', om: 'Godina Shawaa Bahaa', am: 'ምስራቅ ሸዋ ዞን', ar: 'منطقة شرق شوا', fr: 'Zone de Shewa oriental' } },
    { id: 'reg-west-shewa', code: 'west_shewa', label: { en: 'West Shewa Zone', om: 'Godina Shawaa Lixaa', am: 'ምዕራብ ሸዋ ዞን', ar: 'منطقة غرب شوا', fr: 'Zone de Shewa occidental' } },
    { id: 'reg-north-shewa', code: 'north_shewa', label: { en: 'North Shewa Zone', om: 'Godina Shawaa Kaabaa', am: 'ሰሜን ሸዋ ዞን', ar: 'منطقة شمال شوا', fr: 'Zone de Shewa du Nord' } },
    { id: 'reg-sw-shewa', code: 'sw_shewa', label: { en: 'Southwest Shewa Zone', om: 'Godina Shawaa Kibba Lixaa', am: 'ደቡብ ምዕራብ ሸዋ ዞን', ar: 'منطقة جنوب غرب شوا', fr: 'Zone de Shewa du Sud-Ouest' } },
    { id: 'reg-bale', code: 'bale', label: { en: 'Bale Zone', om: 'Godina Baalee', am: 'ባሌ ዞን', ar: 'منطقة بالي', fr: 'Zone de Balé' } },
    { id: 'reg-east-bale', code: 'east_bale', label: { en: 'East Bale Zone', om: 'Godina Baalee Bahaa', am: 'ምስራቅ ባሌ ዞን', ar: 'منطقة شرق بالي', fr: 'Zone de Balé oriental' } },
    { id: 'reg-arsi', code: 'arsi', label: { en: 'Arsi Zone', om: 'Godina Arsii', am: 'አርሲ ዞን', ar: 'منطقة أرسي', fr: 'Zone d\'Arsi' } },
    { id: 'reg-west-arsi', code: 'west_arsi', label: { en: 'West Arsi Zone', om: 'Godina Arsii Lixaa', am: 'ምዕራብ አርሲ ዞን', ar: 'منطقة غرب أرسي', fr: 'Zone d\'Arsi occidental' } },
    { id: 'reg-jimma', code: 'jimma', label: { en: 'Jimma Zone', om: 'Godina Jimmaa', am: 'ጅማ ዞን', ar: 'منطقة جيما', fr: 'Zone de Jimma' } },
    { id: 'reg-illubabor', code: 'illubabor', label: { en: 'Illubabor Zone', om: 'Godina Iluu Abbaa Booraa', am: 'ኢሉባቦር ዞን', ar: 'منطقة إيلوبابور', fr: 'Zone d\'Illubabor' } },
    { id: 'reg-borena', code: 'borena', label: { en: 'Borena Zone', om: 'Godina Booranaa', am: 'ቦረና ዞን', ar: 'منطقة بورينا', fr: 'Zone de Borana' } },
    { id: 'reg-guji', code: 'guji', label: { en: 'Guji Zone', om: 'Godina Gujii', am: 'ጉጂ ዞን', ar: 'منطقة غوجي', fr: 'Zone de Guji' } },
    { id: 'reg-east-hararghe', code: 'east_hararghe', label: { en: 'East Hararghe Zone', om: 'Godina Harargee Bahaa', am: 'ምስራቅ ሐረርጌ ዞን', ar: 'منطقة شرق هررغي', fr: 'Zone d\'Hararghe oriental' } },
    { id: 'reg-west-hararghe', code: 'west_hararghe', label: { en: 'West Hararghe Zone', om: 'Godina Harargee Lixaa', am: 'ምዕራብ ሐረርጌ ዞን', ar: 'منطقة غرب هررغي', fr: 'Zone d\'Hararghe occidental' } },
    { id: 'reg-east-wollega', code: 'east_wollega', label: { en: 'East Wollega Zone', om: 'Godina Wallagga Bahaa', am: 'ምስራቅ ወለጋ ዞን', ar: 'منطقة شرق وlega', fr: 'Zone de Wollega oriental' } },
    { id: 'reg-adama-city', code: 'adama_city', label: { en: 'Adama City Administration', om: 'Bulchiinsa Magaalaa Adaamaa', am: 'አዳማ ከተማ አስተዳደር', ar: 'إدارة مدينة أداما', fr: 'Administration urbaine d\'Adama' } },
    { id: 'reg-bishoftu-city', code: 'bishoftu_city', label: { en: 'Bishoftu City Administration', om: 'Bulchiinsa Magaalaa Bishooftuu', am: 'ቢሾፍቱ ከተማ አስተዳደር', ar: 'إدارة مدينة بيሾፍቱ', fr: 'Administration urbaine de Bishoftu' } },
    { id: 'reg-jimma-city', code: 'jimma_city', label: { en: 'Jimma City Administration', om: 'Bulchiinsa Magaalaa Jimmaa', am: 'ጅማ ከተማ አስተዳደር', ar: 'إدارة مدينة جيما', fr: 'Administration urbaine de Jimma' } },
    { id: 'reg-shashemene-city', code: 'shashemene_city', label: { en: 'Shashemene City Administration', om: 'Bulchiinsa Magaalaa Shaashamannee', am: 'ሻሸመኔ ከተማ አስተዳደር', ar: 'إدارة مدينة شاشاماني', fr: 'Administration urbaine de Shashemene' } },
    { id: 'reg-finfinne-special', code: 'finfinne_special', label: { en: 'Finfinne Surrounding Special Zone', om: 'Godina Addaa Naannawa Finfinnee', am: 'የፊንፊኔ ዙሪያ ልዩ ዞን', ar: 'المنطقة الخاصة المحيطة بفينفيني', fr: 'Zone spéciale autour de Finfinne' } },
    { id: 'reg-other', code: 'other', label: { en: 'Other Region / Outside Oromia', om: 'Naannoo Biroo / Oromiyaan Alaa', am: 'ሌላ ክልል / ከኦሮሚያ ውጭ', ar: 'منطقة أخرى / خارج أوروميا', fr: 'Autre région / Hors d\'Oromia' } },
  ],
  sectors: [
    { id: 'sec-hotel', code: 'hotel', label: { en: 'Hotel & Accommodation', om: 'Hoteela fi Iddoo Bulaa', am: 'ሆቴልና ማረፊያ', ar: 'الفنادق والإقامة', fr: 'Hôtellerie et hébergement' } },
    { id: 'sec-lodge-resort', code: 'lodge_resort', label: { en: 'Lodge & Eco-Resort', om: 'Loojii fi Rizoortii', am: 'ሎጅና ኢኮ-ሪዞርት', ar: 'النزل والمنتجعات البيئية', fr: 'Lodges et éco-resorts' } },
    { id: 'sec-tour-operator', code: 'tour_operator', label: { en: 'Tour Operator', om: 'Dhaabbata Tuurizimii', am: 'የቱር ኦፕሬተር', ar: 'تنظيم الرحلات والجولات السياحية', fr: 'Tour-opérateurs et circuits' } },
    { id: 'sec-travel-agency', code: 'travel_agency', label: { en: 'Travel Agency & Ticketing', om: 'Ejenxii Imalaa', am: 'የጉዞ ወኪል', ar: 'وكالات السفر وحجز التذاكر', fr: 'Agences de voyages et billetterie' } },
    { id: 'sec-restaurant', code: 'restaurant', label: { en: 'Restaurant & Dining', om: 'Manni Nyaataa', am: 'ሬስቶራንት', ar: 'المطاعم والضيافة الغذائية', fr: 'Restauration et gastronomie' } },
    { id: 'sec-catering', code: 'catering', label: { en: 'Catering & Events Service', om: 'Tajaajila Keetiriingii', am: 'የኬተሪንግ አገልግሎት', ar: 'خدمات التموين والفعاليات', fr: 'Traiteur et événementiel' } },
    { id: 'sec-college', code: 'training_college', label: { en: 'Training Institute / University', om: 'Kolleejjii / Yuunivarsiitii', am: 'የስልጠና ተቋም / ዩኒቨርሲቲ', ar: 'المعاهد التدريبية والجامعات', fr: 'Instituts de formation et universités' } },
    { id: 'sec-tourism-bureau', code: 'tourism_bureau', label: { en: 'Tourism Bureau / Public Agency', om: 'Biiroo Tuurizimii', am: 'የቱሪዝም ቢሮ', ar: 'مكاتب وهيئات السياحة الحكومية', fr: 'Offices et bureaux du tourisme' } },
    { id: 'sec-other', code: 'other', label: { en: 'Other Tourism Sector', om: 'Kaan', am: 'ሌላ', ar: 'قطاع سياحي آخر', fr: 'Autre secteur touristique' } },
  ],
  fieldsOfStudy: [
    { id: 'field-tourism-mgt', code: 'tourism_mgt', label: { en: 'Tourism Management', om: 'Hogganummaa Tuurizimii', am: 'የቱሪዝም ማኔጅመንት', ar: 'إدارة السياحة', fr: 'Management du tourisme' } },
    { id: 'field-hospitality-mgt', code: 'hospitality_mgt', label: { en: 'Hospitality Management', om: 'Hogganummaa Keessummeessaa', am: 'የሆስፒታሊቲ ማኔጅመንት', ar: 'إدارة الضيافة والفندقة', fr: 'Management hôtelier' } },
    { id: 'field-hotel-mgt', code: 'hotel_mgt', label: { en: 'Hotel Management & Operations', om: 'Hogganummaa Hoteelaa', am: 'የሆቴል ማኔጅመንት', ar: 'إدارة العمليات الفندقية', fr: 'Gestion et opérations hôtelières' } },
    { id: 'field-culinary', code: 'culinary_arts', label: { en: 'Culinary Arts & Food Production', om: 'Ogeessa Nyaata Qopheessuu', am: 'የምግብ ዝግጅት ጥበብ', ar: 'فنون الطهي وإنتاج الأغذية', fr: 'Arts culinaires et restauration' } },
    { id: 'field-event-mgt', code: 'event_mgt', label: { en: 'Event & Conference Management', om: 'Qindeessaa Sagantaa', am: 'የዝግጅት ማኔጅመንት', ar: 'إدارة المؤتمرات والفعاليات', fr: 'Gestion d\'événements et congrès' } },
    { id: 'field-anthropology', code: 'anthropology', label: { en: 'Heritage & Anthropology Studies', om: 'Antirooppooloojii fi Dhaala', am: 'አንትሮፖሎጂ እና ቅርስ ጥናት', ar: 'دراسات التراث والأنثروبولوجيا', fr: 'Études du patrimoine et anthropologie' } },
    { id: 'field-geography', code: 'geography', label: { en: 'Geography & Environmental Science', om: 'Ji\'oogiraafii fi Naannoo', am: 'ጂኦግራፊና አካባቢ ሳይንስ', ar: 'الجغرافيا والعلوم البيئية', fr: 'Géographie et sciences environnementales' } },
    { id: 'field-other', code: 'other', label: { en: 'Other Related Field', om: 'Muummee Biroo', am: 'ሌላ ተዛማጅ', ar: 'مجال تخصص آخر ذو صلة', fr: 'Autre discipline connexe' } },
  ],
  graduationLevels: [
    { id: 'grad-diploma', code: 'diploma', label: { en: 'Vocational Diploma (TVET)', om: 'Diiploomaa Ogummaa (TVET)', am: 'የቴክኒክና ሙያ ዲፕሎማ', ar: 'دبلوم مهني وتقني', fr: 'Diplôme technique et professionnel' } },
    { id: 'grad-first-degree', code: 'first_degree', label: { en: 'First Degree (BA / BSc)', om: 'Digrii Jalqabaa (BA / BSc)', am: 'የመጀመሪያ ዲግሪ (BA / BSc)', ar: 'درجة البكالوريوس', fr: 'Licence / Bac+3 (BA / BSc)' } },
    { id: 'grad-second-degree', code: 'second_degree', label: { en: 'Second Degree (MA / MSc)', om: 'Digrii Lammaffaa (MA / MSc)', am: 'ሁለተኛ ዲግሪ (MA / MSc)', ar: 'درجة الماجستير', fr: 'Master / Bac+5 (MA / MSc)' } },
    { id: 'grad-third-degree', code: 'third_degree', label: { en: 'Doctorate Degree (PhD)', om: 'Digrii Sadaffaa (PhD)', am: 'የዶክትሬት ዲግሪ (PhD)', ar: 'درجة الدكتوراه', fr: 'Doctorat (PhD)' } },
  ],
  occupationTypes: [
    { id: 'occ-private', code: 'private', label: { en: 'Private Sector Enterprise', om: 'Dhaabbata Dhuunfaa', am: 'የግል ድርጅት', ar: 'مؤسسات القطاع الخاص', fr: 'Entreprise du secteur privé' } },
    { id: 'occ-government', code: 'government', label: { en: 'Government / Public Institution', om: 'Mootummaa / Dhaabbata Ummataa', am: 'የመንግስት ተቋም', ar: 'مؤسسات القطاع العام والحكومي', fr: 'Institution ou organisme public' } },
    { id: 'occ-other', code: 'other', label: { en: 'Freelance / Consultant / Other', om: 'Hojii Dhuunfaa / Kaan', am: 'የግል አማካሪ / ሌላ', ar: 'عمل حر / استشاري مستقل', fr: 'Indépendant / Consultant / Autre' } },
  ],
};
