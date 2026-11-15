/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '../lib/ophea-api-client.js';

export async function submitContact(
  data: { fullName?: string; name?: string; email: string; phone?: string; subject: string; message: string }
): Promise<{ message: string }> {
  return api.sendContact({
    fullName: data.fullName || data.name || '',
    email: data.email,
    phone: data.phone || '',
    subject: data.subject,
    message: data.message,
  });
}
