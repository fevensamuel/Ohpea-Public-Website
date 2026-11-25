/**
 * Contact — editorial redesign.
 * Form behaviour is unchanged: same fields, same client-side validation, same
 * POST /public/contact via api.sendContact(), same ApiError field/general error
 * handling and success state. Office details still come from /public/site-settings.
 */
import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext.js';
import { api, ApiError } from '../lib/ophea-api-client.js';
import { useSiteSettings } from '../hooks/useSiteSettings.js';
import { localize } from '../utils/localize.js';
import { EditorialShell } from '../components/home/EditorialShell.js';
import { EditorialPageHero } from '../components/home/EditorialPageHero.js';
import { Reveal } from '../components/home/Reveal.js';
import { SLOT, photo } from '../components/home/images.js';

const LABEL = 'block text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/55 mb-2';
const FIELD = 'w-full bg-transparent border-b py-3 text-[15px] text-ink placeholder:text-ink/35 focus:outline-hidden transition';
const fieldBorder = (bad: boolean) => (bad ? 'border-ochre-dark' : 'border-ink/30 focus:border-ink');

export const Contact: React.FC = () => {
  const { t, language } = useTranslation();
  const { settings } = useSiteSettings();
  const address = localize(settings.address, language);
  const phones: string[] = settings.contactPhones ?? [];
  const emails: string[] = settings.contactEmails ?? [];
  const mapLink: string = settings.mapLink ?? '';
  const workingHours: string = settings.workingHours ?? '';
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

  const detailHead = 'text-[11px] font-semibold tracking-[0.2em] uppercase text-ochre mb-3';
  const hasOffice = !!address || phones.length > 0 || emails.length > 0 || !!workingHours;

  return (
    <EditorialShell>
      <main id="main">
        <EditorialPageHero
          image={photo(SLOT.contactHero)}
          imageClass="object-[50%_60%]"
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
          crumbs={[{ label: t('nav.contact') }]}
        />

        <Reveal as="section" className="max-w-[1320px] mx-auto px-6 md:px-12 py-24 md:py-32 grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Office details */}
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mb-5">{t('contact.getInTouch')}</h2>
            <p className="text-ink/70 leading-relaxed mb-12 max-w-md">{t('contact.getInTouchDesc')}</p>

            {hasOffice && (
              <div className="border-t border-ink/15 divide-y divide-ink/15">
                {address && (
                  <div className="py-7">
                    <h3 className={detailHead}>{t('contact.hqTitle')}</h3>
                    <p className="text-ink/80 leading-relaxed">{address}</p>
                    {mapLink && (
                      <a href={mapLink} target="_blank" rel="noreferrer" data-cursor="link"
                        className="inline-flex items-center gap-2 mt-3 text-xs font-semibold tracking-[0.16em] uppercase border-b border-ink/40 pb-1 hover:border-ink transition">
                        {t('contact.osmLink')} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
                {phones.length > 0 && (
                  <div className="py-7">
                    <h3 className={detailHead}>{t('contact.phoneTitle')}</h3>
                    {phones.map((p) => (
                      <p key={p} dir="ltr" className="text-ink/80"><a href={`tel:${p.replace(/\s+/g, '')}`} data-cursor="link" className="hover:text-ochre-dark transition">{p}</a></p>
                    ))}
                  </div>
                )}
                {emails.length > 0 && (
                  <div className="py-7">
                    <h3 className={detailHead}>{t('contact.emailTitle')}</h3>
                    {emails.map((e) => (
                      <p key={e} className="text-ink/80"><a href={`mailto:${e}`} data-cursor="link" className="hover:text-ochre-dark transition">{e}</a></p>
                    ))}
                  </div>
                )}
                {workingHours && (
                  <div className="py-7">
                    <h3 className={detailHead}>{t('contact.hoursTitle')}</h3>
                    <p className="text-ink/80">{workingHours}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-sand p-8 sm:p-12">
            <h3 className="font-display text-3xl md:text-4xl mb-2">{t('contact.formTitle')}</h3>
            <p className="text-sm text-ink/60 mb-10">{t('contact.formDesc')}</p>

            {success ? (
              <div role="status" className="py-10 text-center">
                <p className="font-display italic text-3xl text-olive mb-3">{t('contact.sent')}</p>
                <p className="text-sm text-ink/70 max-w-sm mx-auto mb-8">{t('contact.sentDesc')}</p>
                <button type="button" onClick={() => setSuccess(false)} data-cursor="link"
                  className="border border-ink/70 px-7 py-3 font-display text-lg hover:bg-ink hover:text-white transition">
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                  <div>
                    <label htmlFor="contact-name" className={LABEL}>{t('contact.name')} <span aria-hidden="true">*</span></label>
                    <input id="contact-name" type="text" autoComplete="name" value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      aria-invalid={!!(errors.fullName || errors.name)} aria-describedby={errors.fullName || errors.name ? 'err-name' : undefined}
                      className={`${FIELD} ${fieldBorder(!!(errors.fullName || errors.name))}`} placeholder="Your full name" />
                    {(errors.fullName || errors.name) && <p id="err-name" role="alert" className="text-xs text-ochre-dark mt-2">{errors.fullName || errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={LABEL}>{t('form.email')} <span aria-hidden="true">*</span></label>
                    <input id="contact-email" type="email" autoComplete="email" value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined}
                      className={`${FIELD} ${fieldBorder(!!errors.email)}`} placeholder="name@example.com" />
                    {errors.email && <p id="err-email" role="alert" className="text-xs text-ochre-dark mt-2">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className={LABEL}>{t('form.phone')}</label>
                    <input id="contact-phone" type="tel" autoComplete="tel" value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'err-phone' : undefined}
                      className={`${FIELD} ${fieldBorder(!!errors.phone)}`} placeholder="+2519XXXXXXXX" />
                    {errors.phone && <p id="err-phone" role="alert" className="text-xs text-ochre-dark mt-2">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className={LABEL}>{t('contact.subject')} <span aria-hidden="true">*</span></label>
                    <input id="contact-subject" type="text" value={formData.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'err-subject' : undefined}
                      className={`${FIELD} ${fieldBorder(!!errors.subject)}`} placeholder="Inquiry topic" />
                    {errors.subject && <p id="err-subject" role="alert" className="text-xs text-ochre-dark mt-2">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={LABEL}>{t('contact.message')} <span aria-hidden="true">*</span></label>
                  <textarea id="contact-message" rows={5} value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined}
                    className={`${FIELD} ${fieldBorder(!!errors.message)} resize-y`} placeholder="Type your message here..." />
                  {errors.message && <p id="err-message" role="alert" className="text-xs text-ochre-dark mt-2">{errors.message}</p>}
                </div>

                {generalError && (
                  <p role="alert" className="border border-ochre-dark/60 bg-cream px-4 py-3 text-sm text-ochre-dark">{generalError}</p>
                )}

                <button type="submit" disabled={submitting} data-cursor="link"
                  className="border border-ink/80 px-9 py-3.5 font-display text-lg hover:bg-ink hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed transition inline-flex items-center gap-2">
                  {submitting ? <span>Sending...</span> : <><span>{t('contact.send')}</span><span aria-hidden="true">→</span></>}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </main>
    </EditorialShell>
  );
};
