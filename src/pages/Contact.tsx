import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { PageBanner } from '../components/PageBanner.js';
import { api, ApiError } from '../lib/ohpea-api-client.js';

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    // Client-side quick validation
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = t('validation.required');
    if (!formData.email.trim()) errs.email = t('validation.required');
    if (!formData.subject.trim()) errs.subject = t('validation.required');
    if (!formData.message.trim()) errs.message = t('validation.required');

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await api.sendContact({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.fields && Object.keys(err.fields).length > 0) {
          setErrors(err.fields);
        } else {
          setGeneralError(err.message || 'Failed to send message. Please try again.');
        }
      } else {
        setGeneralError((err as Error).message || 'Failed to send message. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      <PageBanner
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        breadcrumbs={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.contact') },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6 text-start">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">
                {t('contact.getInTouch')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                {t('contact.getInTouchDesc')}
              </p>
            </div>

            <div className="space-y-4">
              {/* Head Office */}
              <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                    {t('contact.hqTitle')}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {t('contact.hqAddress')}
                  </p>
                  <a
                    href="https://www.openstreetmap.org/#map=16/9.0105/38.7610"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-amber-400 font-semibold mt-2 hover:underline"
                  >
                    <span>{t('contact.osmLink')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                    {t('contact.phoneTitle')}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">
                    {t('contact.hotlineLabel')}: +251 11 550 4422
                  </p>
                  <p className="text-stone-600 dark:text-stone-400">
                    {t('contact.mobileLabel')}: +251 91 123 4567
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                    {t('contact.emailTitle')}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">{t('contact.generalEmail')}: info@ohpea.org</p>
                  <p className="text-stone-600 dark:text-stone-400">{t('contact.membershipEmail')}: register@ohpea.org</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                    {t('contact.hoursTitle')}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400">
                    {t('contact.hoursText')}
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5">{t('contact.hoursSubtext')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 shadow-sm text-start">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-2">
                {t('contact.formTitle')}
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                {t('contact.formDesc')}
              </p>

              {success ? (
                <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-base mb-2">
                    {t('contact.sent')}
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm mx-auto mb-4">
                    {t('contact.sentDesc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    {t('contact.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('contact.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                          errors.fullName || errors.name ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                        }`}
                        placeholder="Your full name"
                      />
                      {(errors.fullName || errors.name) && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName || errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                          errors.email ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                        }`}
                        placeholder="name@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('form.phone')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                          errors.phone ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                        }`}
                        placeholder="+251 91 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                        {t('contact.subject')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => updateField('subject', e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                          errors.subject ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                        }`}
                        placeholder="Inquiry topic"
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                      {t('contact.message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 dark:bg-stone-800/50 text-sm text-stone-900 dark:text-stone-100 outline-none transition ${
                        errors.message ? 'border-red-500' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500'
                      }`}
                      placeholder="Type your message here..."
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {generalError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{generalError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>{t('contact.send')}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
