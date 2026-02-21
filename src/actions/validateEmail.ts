import { Bundle, ZObject } from 'zapier-platform-core';

type ApiEmail = {
  address: string;
  domain: string;
  canonical: string;
  mx_record: string | null;
  first_name: string | null;
  last_name: string | null;
  email_state: string;
  email_sub_state: string;
  verified_at: string;
  did_you_mean: string | null;
};

const perform = async (z: ZObject, bundle: Bundle) => {
  const response = await z.request({
    url: `https://api.truelist.io/api/v1/verify_inline?email=${encodeURIComponent(bundle.inputData.email)}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 401) {
    throw new z.errors.Error(
      'Authentication failed. Check your API key at https://truelist.io/dashboard',
      'AuthenticationError',
      response.status
    );
  }

  if (response.status === 429) {
    throw new z.errors.Error(
      'Rate limit exceeded. Please wait before making more requests.',
      'ThrottledError',
      response.status
    );
  }

  if (response.status >= 500) {
    throw new z.errors.Error(
      'Truelist API is temporarily unavailable. Please try again later.',
      'ServerError',
      response.status
    );
  }

  if (response.status !== 200) {
    throw new z.errors.Error(
      `Unexpected response from Truelist API (status ${response.status})`,
      'RequestError',
      response.status
    );
  }

  const data = response.json as { emails: ApiEmail[] };
  const result = data.emails[0];

  return {
    email: result.address,
    domain: result.domain,
    canonical: result.canonical,
    mxRecord: result.mx_record,
    firstName: result.first_name,
    lastName: result.last_name,
    state: result.email_state,
    subState: result.email_sub_state,
    verifiedAt: result.verified_at,
    suggestion: result.did_you_mean,
    is_valid: result.email_state === 'ok',
    is_deliverable: result.email_state === 'ok' || result.email_state === 'accept_all',
  };
};

const validateEmail = {
  key: 'validate_email',
  noun: 'Email',
  display: {
    label: 'Validate Email',
    description: 'Validate an email address for deliverability',
  },
  operation: {
    inputFields: [
      {
        key: 'email',
        label: 'Email Address',
        type: 'string',
        required: true,
        helpText: 'The email address to validate',
      },
    ],
    perform,
    sample: {
      email: 'user@example.com',
      domain: 'example.com',
      canonical: 'user',
      mxRecord: null,
      firstName: null,
      lastName: null,
      state: 'ok',
      subState: 'email_ok',
      verifiedAt: '2026-02-21T10:00:00.000Z',
      suggestion: null,
      is_valid: true,
      is_deliverable: true,
    },
    outputFields: [
      { key: 'email', label: 'Email Address', type: 'string' },
      { key: 'domain', label: 'Domain', type: 'string' },
      { key: 'canonical', label: 'Canonical', type: 'string' },
      { key: 'mxRecord', label: 'MX Record', type: 'string' },
      { key: 'firstName', label: 'First Name', type: 'string' },
      { key: 'lastName', label: 'Last Name', type: 'string' },
      { key: 'state', label: 'State', type: 'string' },
      { key: 'subState', label: 'Sub-State', type: 'string' },
      { key: 'verifiedAt', label: 'Verified At', type: 'string' },
      { key: 'suggestion', label: 'Suggestion', type: 'string' },
      { key: 'is_valid', label: 'Is Valid', type: 'boolean' },
      { key: 'is_deliverable', label: 'Is Deliverable', type: 'boolean' },
    ],
  },
};

export default validateEmail;
