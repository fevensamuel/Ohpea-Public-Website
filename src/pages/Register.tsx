import React, { useState } from 'react';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { useLookups } from '../hooks/useLookups.js';
import { PageBanner } from '../components/PageBanner.js';
import { api, ApiError } from '../lib/ohpea-api-client.js';

const isFile = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

const registrationSchema = z.object({
  membershipCategory: z.string().min(1, 'Please select a membership category.')
    .refine((value) => ['Professional', 'Entrepreneur', 'Corporate', 'Associate'].includes(value), 'Select a valid membership category.'),
  fullName: z.string().trim().min(1, 'Full name is required.'),
  gender: z.string().refine((value): boolean => value === 'Male' || value === 'Female', 'Please select a gender.'),
  dateOfBirth: z.string(),
  nationality: z.string().trim().min(1, 'Nationality is required.'),
  nationalId: z.string(),
  phone: z.string().trim().min(1, 'Phone number is required.')
    .regex(/^\+251[\s-]?[97](?:[\s-]?\d){8}$/, 'Enter a phone number in +251 format.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  region: z.string(),
  zoneSubCity: z.string(),
  woreda: z.string(),
  cityTown: z.string(),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  employmentStatus: z.enum(['Employed', 'Self-Employed', 'Freelancer', 'Job Seeker']),
  organization: z.string(),
  jobTitle: z.string(),
  businessTin: z.string(),
  yearEstablished: z.string(),
  industrySubSectors: z.array(z.string()),
  highestQualification: z.string(),
  fieldOfStudy: z.string(),
  institutionName: z.string(),
  coreSkills: z.string(),
  areasOfExpertise: z.array(z.string()),
  areasOfInterest: z.array(z.string()),
  idDocument: z.custom<File | null>((value): value is File | null => value === null || isFile(value))
    .refine((value): boolean => value !== null, 'Please upload your ID document.'),
  cvCompanyProfile: z.custom<File | null>((value): value is File | null => value === null || isFile(value))
    .refine((value): boolean => value !== null, 'Please upload your CV or company profile.'),
  academicCertificates: z.array(z.custom<File>(isFile)),
  declaration: z.boolean().refine((value) => value, 'Please confirm the declaration.'),
});

type RegistrationValues = z.infer<typeof registrationSchema>;
type RegistrationField = keyof RegistrationValues;

const defaultValues: RegistrationValues = {
  membershipCategory: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  nationality: 'Ethiopian',
  nationalId: '',
  phone: '',
  email: '',
  region: '',
  zoneSubCity: '',
  woreda: '',
  cityTown: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  employmentStatus: 'Employed',
  organization: '',
  jobTitle: '',
  businessTin: '',
  yearEstablished: '',
  industrySubSectors: [],
  highestQualification: '',
  fieldOfStudy: '',
  institutionName: '',
  coreSkills: '',
  areasOfExpertise: [],
  areasOfInterest: [],
  idDocument: null,
  cvCompanyProfile: null,
  academicCertificates: [],
  declaration: false,
};

// These arrays will be translated inside the component
const industrySubSectors = ['Hotel', 'Restaurant', 'Tour Agency', 'Travel Agency', 'Tour Operator', 'Tour Guiding', 'Lodge / Resort', 'Catering', 'Events and Conference', 'Tourism Education / Training', 'Other'];
const expertiseAreas = ['Hotel and accommodation management', 'Food preparation and culinary arts', 'Restaurant and food service', 'Tour guiding and tour operations', 'Travel agency and ticketing', 'Event and conference management', 'Tourism marketing and promotion', 'Hospitality training and education', 'Tourism research and planning', 'Customer service', 'Other'];
const interestAreas = ['Professional training and capacity building', 'Networking and job opportunities', 'Research and tourism development', 'Advocacy for hospitality and tourism professionals', 'Quality standards and service improvement', 'Sustainable tourism', 'Business and investment opportunities', 'Other'];

const fieldClassName = 'w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-500 dark:border-stone-700 dark:bg-stone-800/60 dark:text-stone-100';
const labelClassName = 'mb-1.5 block text-sm font-semibold text-stone-700 dark:text-stone-300';

function lookupLabel(item: { label?: Record<string, string | undefined>; localizedLabel?: string; code?: string; }, language: string) {
  const localized = item?.label?.[language];
  if (typeof localized === 'string') return localized;
  if (typeof item?.label?.en === 'string') return item.label.en;
  if (typeof item?.localizedLabel === 'string') return item.localizedLabel;
  return typeof item?.code === 'string' ? item.code : '';
}

export const Register: React.FC = () => {
  const { t, language } = useTranslation();
  const { lookups } = useLookups();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  
  const { register, control, handleSubmit, getValues, setError, clearErrors, watch, formState: { errors } } = useForm<RegistrationValues>({ defaultValues });

  const stepFields: RegistrationField[][] = [
    ['membershipCategory', 'fullName', 'gender', 'dateOfBirth', 'nationality', 'nationalId', 'phone', 'email', 'region', 'zoneSubCity', 'woreda', 'cityTown', 'emergencyContactName', 'emergencyContactPhone'],
    ['employmentStatus', 'organization', 'jobTitle', 'businessTin', 'yearEstablished', 'industrySubSectors', 'highestQualification', 'fieldOfStudy', 'institutionName', 'coreSkills', 'areasOfExpertise', 'areasOfInterest'],
    ['idDocument', 'cvCompanyProfile', 'academicCertificates', 'declaration'],
  ];

  const validateStep = (step: number) => {
    const schema = step === 1
      ? registrationSchema.pick({ membershipCategory: true, fullName: true, gender: true, dateOfBirth: true, nationality: true, nationalId: true, phone: true, email: true, region: true, zoneSubCity: true, woreda: true, cityTown: true, emergencyContactName: true, emergencyContactPhone: true })
      : step === 2
        ? registrationSchema.pick({ employmentStatus: true, organization: true, jobTitle: true, businessTin: true, yearEstablished: true, industrySubSectors: true, highestQualification: true, fieldOfStudy: true, institutionName: true, coreSkills: true, areasOfExpertise: true, areasOfInterest: true })
        : registrationSchema.pick({ idDocument: true, cvCompanyProfile: true, academicCertificates: true, declaration: true });
    const result = schema.safeParse(getValues());
    clearErrors();
    if (result.success) return true;
    for (const issue of result.error.issues) {
      setError(issue.path[0] as RegistrationField, { type: 'validation', message: issue.message });
    }
    return false;
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setSubmissionError('');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const submitApplication = async (values: RegistrationValues) => {
    const validated = registrationSchema.safeParse(values);
    if (!validated.success) {
      const issues = validated.error.issues;
      for (const issue of issues) {
        setError(issue.path[0] as RegistrationField, { type: 'validation', message: issue.message });
      }
      const firstInvalidField = issues[0]?.path[0] as RegistrationField | undefined;
      const invalidStep = stepFields.findIndex((fields) => firstInvalidField ? fields.includes(firstInvalidField) : false);
      if (invalidStep >= 0) goToStep(invalidStep + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError('');
    const payload = new FormData();
    
    // Transform fields to match exactly what the backend expects
    const transformed: Record<string, any> = {
      ...validated.data,
      gender: validated.data.gender.toLowerCase(), // Backend expects lowercase
      graduationLevelId: validated.data.highestQualification, // Backend expects this name
      fieldOfStudyId: validated.data.fieldOfStudy, // Backend expects this name
      occupationType: validated.data.employmentStatus, // Backend expects this name
      idType: 'fayda', // Default to fayda since the form doesn't ask
      idNumber: validated.data.nationalId || '0000',
      town: validated.data.cityTown,
      employer: validated.data.organization,
    };

    for (const [key, value] of Object.entries(transformed)) {
      if (isFile(value)) {
        payload.append(key, value);
      } else if (Array.isArray(value)) {
        if (value.some(isFile)) {
          value.filter(isFile).forEach((file) => payload.append(key, file));
        } else {
          payload.append(key, JSON.stringify(value));
        }
      } else if (value !== null && value !== undefined) {
        payload.append(key, String(value));
      }
    }

    try {
      await api.submitRegistration(payload);
      setSubmissionComplete(true);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (error: unknown) {
      setSubmissionError(error instanceof ApiError ? error.message : error instanceof Error ? error.message : 'We could not submit your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const category = watch('membershipCategory');
  const selectedIndustry = watch('industrySubSectors') || [];
  const selectedExpertise = watch('areasOfExpertise') || [];
  const selectedInterests = watch('areasOfInterest') || [];

  const renderCheckboxes = (field: 'industrySubSectors' | 'areasOfExpertise' | 'areasOfInterest', options: string[]) => {
    const selected = field === 'industrySubSectors' ? selectedIndustry : field === 'areasOfExpertise' ? selectedExpertise : selectedInterests;
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2.5 rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-700 dark:border-stone-700 dark:text-stone-300">
            <input type="checkbox" value={option} checked={selected.includes(option)} {...register(field)} className="mt-0.5 accent-emerald-700" />
            <span>{t(`register.options.${option}`, option)}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderFileField = (name: 'idDocument' | 'cvCompanyProfile' | 'academicCertificates', label: string, multiple = false, required = false) => (
    <Controller control={control} name={name} render={({ field }) => (
      <div>
        <label className={labelClassName}>{label}{required && <span className="text-red-600"> *</span>}</label>
        <input type="file" multiple={multiple} accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => {
          const files = Array.from(event.target.files || []);
          field.onChange(multiple ? files : files[0] || null);
        }} className={`${fieldClassName} file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white`} />
        {errors[name]?.message && <p className="mt-1 text-xs text-red-600">{errors[name]?.message}</p>}
      </div>
    )} />
  );

  const fieldError = (name: RegistrationField) => errors[name]?.message;

  return (
    <div className="space-y-12 pb-16">
      <PageBanner title={t('register.title')} subtitle={t('register.subtitle')} breadcrumbs={[{ label: t('nav.home'), to: '/' }, { label: t('nav.membership'), to: '/membership' }, { label: t('register.title') }]} />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {submissionComplete ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-900 dark:bg-stone-900 sm:p-12">
            <CheckCircle2 className="mx-auto mb-5 h-16 w-16 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{t('register.successTitle', 'Thank you')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-600 dark:text-stone-300">{t('register.successDesc', 'Your application has been received and is under review.')}</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-10">
            <div className="mb-8 grid grid-cols-3 gap-3" aria-label="Registration progress">
              {['Personal', 'Professional', 'Documents & Submit'].map((title, index) => (
                <div key={title} className="text-center">
                  <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${currentStep === index + 1 ? 'bg-amber-500 text-stone-950' : currentStep > index + 1 ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400'}`}>{index + 1}</div>
                  <span className={`mt-2 block text-xs ${currentStep === index + 1 ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'}`}>{t(`register.steps.${index + 1}`, title)}</span>
                </div>
              ))}
            </div>

            <form noValidate onSubmit={handleSubmit(submitApplication)} className="space-y-7">
              {currentStep === 1 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('register.step1Title', 'Personal Information')}</h2>
                    <p className="mt-1 text-sm text-stone-500">{t('register.step1Desc', 'Enter your personal and contact details.')}</p>
                  </div>

                  <div>
                    <label className={labelClassName}>{t('register.membershipCategory', 'Membership Category')} <span className="text-red-600">*</span></label>
                    <select {...register('membershipCategory')} className={fieldClassName}>
                      <option value="">{t('register.selectCategory', 'Select a category')}</option>
                      {['Professional', 'Entrepreneur', 'Corporate', 'Associate'].map((item) => (
                        <option key={item} value={item}>{t(`register.categories.${item}`, item)}</option>
                      ))}
                    </select>
                    {fieldError('membershipCategory') && <p className="mt-1 text-xs text-red-600">{fieldError('membershipCategory')}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClassName}>{t('register.fullName', 'Full Name')} <span className="text-red-600">*</span></label>
                      <input {...register('fullName')} className={fieldClassName} autoComplete="name" />
                      {fieldError('fullName') && <p className="mt-1 text-xs text-red-600">{fieldError('fullName')}</p>}
                    </div>
                    <fieldset>
                      <legend className={labelClassName}>{t('register.gender', 'Gender')} <span className="text-red-600">*</span></legend>
                      <div className="flex gap-6 py-2">
                        {(['Male', 'Female'] as const).map((gender) => (
                          <label key={gender} className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                            <input type="radio" value={gender} {...register('gender')} className="accent-emerald-700" />
                            {t(`register.genders.${gender}`, gender)}
                          </label>
                        ))}
                      </div>
                      {fieldError('gender') && <p className="text-xs text-red-600">{fieldError('gender')}</p>}
                    </fieldset>
                    <div>
                      <label className={labelClassName}>{t('register.dob', 'Date of Birth')}</label>
                      <input type="date" {...register('dateOfBirth')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.nationality', 'Nationality')}</label>
                      <input {...register('nationality')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.nationalId', 'National ID / Fayda Number')}</label>
                      <input {...register('nationalId')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.phone', 'Phone')} <span className="text-red-600">*</span></label>
                      <input {...register('phone')} type="tel" placeholder="+251 91 123 4567" className={fieldClassName} />
                      {fieldError('phone') && <p className="mt-1 text-xs text-red-600">{fieldError('phone')}</p>}
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.email', 'Email')} <span className="text-red-600">*</span></label>
                      <input {...register('email')} type="email" autoComplete="email" className={fieldClassName} />
                      {fieldError('email') && <p className="mt-1 text-xs text-red-600">{fieldError('email')}</p>}
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.region', 'Region / City')}</label>
                      <select {...register('region')} className={fieldClassName}>
                        <option value="">{t('register.selectRegion', 'Select a region')}</option>
                        {(lookups?.regions || []).map((region) => (
                          <option key={region?.id || region?.code} value={region?.id || region?.code}>{lookupLabel(region, language)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.zone', 'Zone / Sub-City')}</label>
                      <input {...register('zoneSubCity')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.woreda', 'Woreda')}</label>
                      <input {...register('woreda')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.city', 'City / Town')}</label>
                      <input {...register('cityTown')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.emergencyName', 'Emergency Contact Name')}</label>
                      <input {...register('emergencyContactName')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.emergencyPhone', 'Emergency Contact Phone')}</label>
                      <input {...register('emergencyContactPhone')} type="tel" className={fieldClassName} />
                    </div>
                  </div>
                </section>
              )}

              {currentStep === 2 && (
                <section className="space-y-7">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('register.step2Title', 'Employment, Education & Expertise')}</h2>
                    <p className="mt-1 text-sm text-stone-500">{t('register.step2Desc', 'Tell us about your professional background and interests.')}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClassName}>{t('register.employmentStatus', 'Current Employment Status')}</label>
                      <select {...register('employmentStatus')} className={fieldClassName}>
                        {['Employed', 'Self-Employed', 'Freelancer', 'Job Seeker'].map((status) => (
                          <option key={status} value={status}>{t(`register.employment.${status}`, status)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.org', 'Current Organization / Business Name')}</label>
                      <input {...register('organization')} className={fieldClassName} />
                    </div>
                    <div>
                      <label className={labelClassName}>{t('register.jobTitle', 'Job Title')}</label>
                      <input {...register('jobTitle')} className={fieldClassName} />
                    </div>
                    {category === 'Entrepreneur' && (
                      <>
                        <div>
                          <label className={labelClassName}>{t('register.businessTin', 'Business TIN')}</label>
                          <input {...register('businessTin')} className={fieldClassName} />
                        </div>
                        <div>
                          <label className={labelClassName}>{t('register.yearEstablished', 'Year Established')}</label>
                          <input {...register('yearEstablished')} type="number" min="1900" max={new Date().getFullYear()} className={fieldClassName} />
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-base font-bold text-stone-900 dark:text-white">{t('register.industrySub', 'Industry Sub-Sector')}</h3>
                    {renderCheckboxes('industrySubSectors', industrySubSectors)}
                  </div>

                  <div>
                    <h3 className="mb-3 text-base font-bold text-stone-900 dark:text-white">{t('register.education', 'Education')}</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className={labelClassName}>{t('register.qualification', 'Highest Qualification')}</label>
                        <select {...register('highestQualification')} className={fieldClassName}>
                          <option value="">{t('register.selectQual', 'Select qualification')}</option>
                          {(lookups?.graduationLevels || []).map((item) => (
                            <option key={item?.id || item?.code} value={item?.code || item?.id}>{lookupLabel(item, language)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClassName}>{t('register.fieldOfStudy', 'Field of Study')}</label>
                        <select {...register('fieldOfStudy')} className={fieldClassName}>
                          <option value="">{t('register.selectField', 'Select field')}</option>
                          {(lookups?.fieldsOfStudy || []).map((item) => (
                            <option key={item?.id || item?.code} value={item?.code || item?.id}>{lookupLabel(item, language)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClassName}>{t('register.institution', 'Institution Name')}</label>
                        <input {...register('institutionName')} className={fieldClassName} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClassName}>{t('register.coreSkills', 'Core Skills')}</label>
                    <textarea {...register('coreSkills')} rows={3} className={fieldClassName} />
                  </div>
                  <div>
                    <h3 className="mb-3 text-base font-bold text-stone-900 dark:text-white">{t('register.expertise', 'Areas of Expertise')}</h3>
                    {renderCheckboxes('areasOfExpertise', expertiseAreas)}
                  </div>
                  <div>
                    <h3 className="mb-3 text-base font-bold text-stone-900 dark:text-white">{t('register.interests', 'Areas of Interest in OHPEA')}</h3>
                    {renderCheckboxes('areasOfInterest', interestAreas)}
                  </div>
                </section>
              )}

              {currentStep === 3 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('register.step3Title', 'Documents & Declaration')}</h2>
                    <p className="mt-1 text-sm text-stone-500">{t('register.step3Desc', 'Upload the required documents and review your declaration.')}</p>
                  </div>
                  {renderFileField('idDocument', t('register.idDocument', 'ID Document'), false, true)}
                  {renderFileField('cvCompanyProfile', category === 'Corporate' ? t('register.companyProfile', 'Company Profile') : t('register.cv', 'CV / Company Profile'), false, true)}
                  {renderFileField('academicCertificates', t('register.academicCerts', 'Academic Certificates (optional)'), true)}
                  <div>
                    <label className="flex items-start gap-3 rounded-xl border border-stone-200 p-4 text-sm leading-relaxed text-stone-700 dark:border-stone-700 dark:text-stone-300">
                      <input type="checkbox" {...register('declaration')} className="mt-1 accent-emerald-700" />
                      <span>{t('register.declaration', 'I certify that all information provided in this application is true and accurate to the best of my knowledge.')}</span>
                    </label>
                    {fieldError('declaration') && <p className="mt-1 text-xs text-red-600">{fieldError('declaration')}</p>}
                  </div>
                  {submissionError && (
                    <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {submissionError}
                    </div>
                  )}
                </section>
              )}

              <div className="flex items-center justify-between border-t border-stone-100 pt-5 dark:border-stone-800">
                {currentStep > 1 ? (
                  <button type="button" onClick={() => goToStep(currentStep - 1)} className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 dark:border-stone-700 dark:text-stone-200">
                    <ArrowLeft className="h-4 w-4" /> {t('register.back', 'Back')}
                  </button>
                ) : <span />}
                {currentStep < 3 ? (
                  <button type="button" onClick={() => validateStep(currentStep) && goToStep(currentStep + 1)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-900">
                    {t('register.continue', 'Continue')} <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} onClick={() => validateStep(3)} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-stone-950 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? t('register.submitting', 'Submitting…') : t('register.submit', 'Submit Application')}
                    {!isSubmitting && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};