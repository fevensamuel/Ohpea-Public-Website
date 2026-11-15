/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { api } from '../lib/ophea-api-client.js';

export async function subscribeNewsletter(
  email: string,
  name?: string,
  language?: string
): Promise<{ message: string }> {
  return api.subscribeNewsletter({
    email,
    name,
    language: language === 'om' || language === 'am' ? language : 'en',
  });
}
