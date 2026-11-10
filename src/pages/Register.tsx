import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Building,
  MapPin,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { useLookups } from '../hooks/useLookups.js';
import { PageBanner } from '../components/PageBanner.js';
import { StepIndicator } from '../components/registration/StepIndicator.js';
import { FileUpload } from '../components/registration/FileUpload.js';
import { SuccessPanel } from '../components/registration/SuccessPanel.js';
import { OtpInput } from '../components/registration/OtpInput.js';
import { api, ApiError, RegistrationForm } from '../lib/ohpea-api-client.js';

interface FormDataState {
  // Step 1: Personal
  fullName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | '';
  dob: string;
  // Step 2: Work & Education
  graduationLevel: string;
  fieldOfStudy: string;
  sectorType: string;
  sector: string;
  organization: string;
  jobTitle: string;
  profCategory: string;
  // Step 3: Location & ID
  region: string;
  town: string;
  idType: 'fayda' | 'kebele' | 'passport';
  idNumber: string;
  // Step 5: Consent
  consent: boolean;
}

const INITIAL_FORM: FormDataState = {
  fullName: '',
  phone: '',
  email: '',
  gender: 'male',
  dob: '',
  graduationLevel: 'first_degree',
  fieldOfStudy: 'hospitality_mgt',
  sectorType: 'private',
  sector: 'hotel',
  organization: '',
  jobTitle: '',
  profCategory: 'practitioner',
  region: 'reg-east-shewa',
  town: '',
  idType: 'fayda',
  idNumber: '',
  consent: false,
};

const STORAGE_KEY = 'ohpea_reg_draft';

export const Register: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { lookups } = useLookups();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FORM;
  });

  const [idFiles, setIdFiles] = useState<File[]>([]);
  const [credentialFiles, setCredentialFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    memberNo: string;
    message: string;
  } | null>(null);

  // OTP flow state (component memory only, never stored in localStorage / sessionStorage)
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [pendingRegistrationId, setPendingRegistrationId] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Save draft to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const updateField = (field: keyof FormDataState, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = t('validation.required');
      if (!formData.phone.trim()) {
        errs.phone = t('validation.required');
      } else if (!/^(\+251|0)?[97]\d{8}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
        errs.phone = t('validation.invalidPhone');
      }
      if (!formData.email.trim()) {
        errs.email = t('validation.required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = t('validation.invalidEmail');
      }
      if (!formData.dob) errs.dob = t('validation.required');
    }

    if (step === 2) {
      if (!formData.organization.trim()) errs.organization = t('validation.required');
      if (!formData.jobTitle.trim()) errs.jobTitle = t('validation.required');
    }

    if (step === 3) {
      if (!formData.town.trim()) errs.town = t('validation.required');
      if (!formData.idNumber.trim()) errs.idNumber = t('validation.required');
    }

    if (step === 4) {
      if (idFiles.length === 0) {
        errs.idFile = t('register.idDocError');
      }
    }

    if (step === 5) {
      if (!formData.consent) {
        errs.consent = t('validation.consentRequired');
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // INVARIANT: backend requires send → submit → verify. Do not reorder.
  const handleVerifyOtp = async (code: string): Promise<boolean> => {
    const idFile = idFiles[0];
    if (!idFile) {
      setOtpError('ID document is required.');
      return false;
    }

    setOtpError(null);
    try {
      let regId = pendingRegistrationId;
      if (!regId) {
        const res = await api.submitRegistration({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.graduationLevel,
          fieldOfStudy: formData.fieldOfStudy,
          organization: formData.organization,
          zone: formData.region,
          idType: formData.idType as RegistrationForm['idType'],
          idNumber: formData.idNumber,
          idDocument: idFile,
          credentialDocs: credentialFiles,
        });
        regId = res.registrationId;
        setPendingRegistrationId(regId);
      }

      await api.verifyRegistrationOtp(formData.phone, code);

      setSubmissionResult({
        memberNo: regId || `OHPEA-${Date.now().toString().slice(-6)}`,
        message: 'Your registration has been submitted and verified successfully. The membership committee is reviewing your application.',
      });
      sessionStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return true;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setOtpError(err.message || t('otp.incorrect'));
      } else {
        setOtpError((err as Error).message || t('otp.failed'));
      }
      return false;
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    try {
      await api.sendRegistrationOtp(formData.phone);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setOtpError(err.message);
      } else {
        setOtpError((err as Error).message || 'Failed to resend code');
      }
    }
  };

  // INVARIANT: backend requires send → submit → verify. Do not reorder.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    const idFile = idFiles[0];
    if (!idFile) {
      setErrors({ idFile: t('register.idDocError'), idDocument: t('register.idDocError') });
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setOtpError(null);
    try {
      // 1. Send OTP first
      await api.sendRegistrationOtp(formData.phone);
      setPendingPhone(formData.phone);
      setIsOtpStep(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.fields && Object.keys(err.fields).length > 0) {
          const mapped = { ...err.fields };
          if (mapped.idDocument) mapped.idFile = mapped.idDocument;
          setErrors(mapped);
          if (mapped.fullName || mapped.phone || mapped.email || mapped.dob) {
            setCurrentStep(1);
          } else if (mapped.organization || mapped.jobTitle || mapped.qualification || mapped.fieldOfStudy) {
            setCurrentStep(2);
          } else if (mapped.zone || mapped.region || mapped.town || mapped.idNumber || mapped.idType) {
            setCurrentStep(3);
          } else if (mapped.idDocument || mapped.idFile || mapped.credentialDocs) {
            setCurrentStep(4);
          }
        } else {
          setErrors({ form: err.message || 'Failed to send verification code. Please check your phone number.' });
        }
      } else {
        setErrors({ form: (err as Error).message || 'Failed to send verification code. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDraft = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setFormData(INITIAL_FORM);
    setIdFiles([]);
    setCredentialFiles([]);
    setErrors({});
    setPendingRegistrationId(null);
    setPendingPhone(null);
    setIsOtpStep(false);
    setOtpError(null);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-12 pb-16">
      <PageBanner
        title={t('register.title')}
        subtitle={t('register.subtitle')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.membership'), to: '/membership' },
          { label: t('register.title') },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submissionResult ? (
          <SuccessPanel
            memberNumber={submissionResult.memberNo}
            fullName={formData.fullName}
            email={formData.email}
            phone={formData.phone}
          />
        ) : isOtpStep ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm text-center">
            <OtpInput
              phone={pendingPhone || formData.phone}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
            />
            {otpError && (
              <div className="max-w-md mx-auto mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-300">
                {otpError}
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
              >
                <BackIcon className="w-4 h-4" />
                <span>{t('register.back')}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            {/* Step Progress Bar */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={5}
              onStepClick={(s) => setCurrentStep(s)}
            />

            <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-start">
              {/* STEP 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('register.step1')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {t('register.step1Desc')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.fullName')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                          placeholder="e.g. Tolosa Caala Gutama"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.fullName ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.phone')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="+251 91 123 4567"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.phone ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.email')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="tolosa@example.com"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.email ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.gender')}
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => updateField('gender', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        <option value="male">{t('form.male')}</option>
                        <option value="female">{t('form.female')}</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.dob')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => updateField('dob', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.dob ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Work & Education */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('register.step2')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {t('register.step2Desc')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Graduation Level */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.graduationLevel')}
                      </label>
                      <select
                        value={formData.graduationLevel}
                        onChange={(e) => updateField('graduationLevel', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        {lookups.graduationLevels.map((lvl) => (
                          <option key={lvl.code} value={lvl.code}>
                            {lvl.label[language] || lvl.label.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Field of Study */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.fieldOfStudy')}
                      </label>
                      <select
                        value={formData.fieldOfStudy}
                        onChange={(e) => updateField('fieldOfStudy', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        {lookups.fieldsOfStudy.map((fld) => (
                          <option key={fld.code} value={fld.code}>
                            {fld.label[language] || fld.label.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sector Type */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.sectorType')}
                      </label>
                      <select
                        value={formData.sectorType}
                        onChange={(e) => updateField('sectorType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        {lookups.occupationTypes.map((occ) => (
                          <option key={occ.code} value={occ.code}>
                            {occ.label[language] || occ.label.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Industry Sector */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.sector')}
                      </label>
                      <select
                        value={formData.sector}
                        onChange={(e) => updateField('sector', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        {lookups.sectors.map((sec) => (
                          <option key={sec.code} value={sec.code}>
                            {sec.label[language] || sec.label.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Employer / Organization */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.organization')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          value={formData.organization}
                          onChange={(e) => updateField('organization', e.target.value)}
                          placeholder="e.g. Kuriftu Resort / Haile Grand"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.organization ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.organization && <p className="text-xs text-red-500 mt-1">{errors.organization}</p>}
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.jobTitle')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          value={formData.jobTitle}
                          onChange={(e) => updateField('jobTitle', e.target.value)}
                          placeholder="e.g. Operations Manager / Executive Chef"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.jobTitle ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.jobTitle && <p className="text-xs text-red-500 mt-1">{errors.jobTitle}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Location & ID */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('register.step3')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {t('register.step3Desc')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Zone / Region */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.region')}
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => updateField('region', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        {lookups.regions.map((reg) => (
                          <option key={reg.id} value={reg.id}>
                            {reg.label[language] || reg.label.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Town / City */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.town')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          value={formData.town}
                          onChange={(e) => updateField('town', e.target.value)}
                          placeholder="e.g. Bishoftu / Adama / Jimma"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.town ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.town && <p className="text-xs text-red-500 mt-1">{errors.town}</p>}
                    </div>

                    {/* ID Type */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.idType')}
                      </label>
                      <select
                        value={formData.idType}
                        onChange={(e) => updateField('idType', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                      >
                        <option value="fayda">{t('register.idTypeFayda')}</option>
                        <option value="kebele">{t('register.idTypeKebele')}</option>
                        <option value="passport">{t('register.idTypePassport')}</option>
                      </select>
                    </div>

                    {/* ID Number */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.idNumber')} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          type="text"
                          value={formData.idNumber}
                          onChange={(e) => updateField('idNumber', e.target.value)}
                          placeholder="e.g. FIN-9812-4019"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                            errors.idNumber ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                          }`}
                        />
                      </div>
                      {errors.idNumber && <p className="text-xs text-red-500 mt-1">{errors.idNumber}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents Upload */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('register.step4')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {t('register.step4Desc')}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <FileUpload
                      label={t('form.idDoc')}
                      helperText={t('register.idDocHelper')}
                      files={idFiles}
                      onChange={setIdFiles}
                      required
                      error={errors.idDocument || errors.idFile}
                    />

                    <FileUpload
                      label={t('form.credentialDocs')}
                      helperText={t('register.credentialDocsHelper')}
                      multiple
                      maxFiles={5}
                      files={credentialFiles}
                      onChange={setCredentialFiles}
                      error={errors.credentialDocs}
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Consent */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {t('register.step5')}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {t('register.step5Desc')}
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-700 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.applicantName')}:</span>
                        <span className="font-bold text-stone-900 dark:text-white text-sm">
                          {formData.fullName || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.phoneEmail')}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {formData.phone} &bull; {formData.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.employment')}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {formData.jobTitle} {t('register.at')} {formData.organization}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.qualification')}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {formData.graduationLevel} ({formData.fieldOfStudy})
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.location')}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {formData.town}, {formData.region}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.identification')}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 uppercase">
                          {formData.idType}: {formData.idNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-medium">{t('register.attachedDocs')}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          ID: {idFiles.length > 0 ? idFiles[0].name : '—'} &bull; Credentials: {credentialFiles.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consent checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => updateField('consent', e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-stone-300"
                      />
                      <span className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {t('form.consentText')}
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {errors.form && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-stone-100 dark:border-stone-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition cursor-pointer"
                  >
                    <BackIcon className="w-4 h-4" />
                    <span>{t('register.back')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('register.reset')}</span>
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <span>{t('register.continue')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition"
                  >
                    {isSubmitting ? (
                      <span>{t('form.submitting')}</span>
                    ) : (
                      <>
                        <span>{t('form.submit')}</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
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
