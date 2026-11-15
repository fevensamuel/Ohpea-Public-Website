/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api, RegistrationForm } from '../lib/ophea-api-client.js';

export async function submitRegistration(
  form: RegistrationForm | FormData
): Promise<{ memberNo: string; message: string; registrationId?: string }> {
  if (!(form instanceof FormData)) {
    const res = await api.submitRegistration(form);
    return {
      memberNo: res.registrationId || `OPHEA-${Date.now().toString().slice(-6)}`,
      message: 'Registration submitted successfully.',
      registrationId: res.registrationId,
    };
  }

  const fullName = (form.get('fullName') as string) || '';
  const email = (form.get('email') as string) || '';
  const phone = (form.get('phone') as string) || '';
  const qualification = (form.get('qualification') || form.get('graduationLevel')) as string | undefined;
  const fieldOfStudy = form.get('fieldOfStudy') as string | undefined;
  const organization = form.get('organization') as string | undefined;
  const zone = (form.get('zone') || form.get('region')) as string | undefined;
  const idType = ((form.get('idType') as string) || 'fayda') as RegistrationForm['idType'];
  const idNumber = (form.get('idNumber') as string) || '';
  const idDocument = form.get('idDocument') as File;
  const credentialDocs = (form.getAll('credentialDocs').concat(form.getAll('credentials')) as unknown[]).filter(
    (f): f is File => f instanceof File
  );

  const res = await api.submitRegistration({
    fullName,
    email,
    phone,
    qualification,
    fieldOfStudy,
    organization,
    zone,
    idType,
    idNumber,
    idDocument,
    credentialDocs,
  });

  return {
    memberNo: res.registrationId || `OPHEA-${Date.now().toString().slice(-6)}`,
    message: 'Registration submitted successfully.',
    registrationId: res.registrationId,
  };
}

export async function requestRegistrationOtp(phone: string): Promise<{ message: string }> {
  return api.sendRegistrationOtp(phone);
}

export async function verifyRegistrationOtp(phone: string, code: string): Promise<{ verified: boolean }> {
  return api.verifyRegistrationOtp(phone, code);
}
