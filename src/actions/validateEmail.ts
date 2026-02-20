import { Bundle, ZObject } from 'zapier-platform-core';

type ValidationResult = {
  state: string;
  sub_state: string;
  suggestion: string | null;
  free_email: boolean;
  role: boolean;
  disposable: boolean;
};

const perform = async (z: ZObject, bundle: Bundle) => {
  const response = await z.request({
    url: 'https://api.truelist.io/api/v1/verify',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: bundle.inputData.email }),
  });

  const result = response.json as ValidationResult;

  return {
    ...result,
    email: bundle.inputData.email,
    is_valid: result.state === 'valid',
    is_deliverable: result.state === 'valid' || result.state === 'risky',
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
      state: 'valid',
      sub_state: 'ok',
      suggestion: null,
      free_email: false,
      role: false,
      disposable: false,
      is_valid: true,
      is_deliverable: true,
    },
    outputFields: [
      { key: 'email', label: 'Email Address', type: 'string' },
      { key: 'state', label: 'State', type: 'string' },
      { key: 'sub_state', label: 'Sub-State', type: 'string' },
      { key: 'suggestion', label: 'Suggestion', type: 'string' },
      { key: 'free_email', label: 'Free Email', type: 'boolean' },
      { key: 'role', label: 'Role Address', type: 'boolean' },
      { key: 'disposable', label: 'Disposable', type: 'boolean' },
      { key: 'is_valid', label: 'Is Valid', type: 'boolean' },
      { key: 'is_deliverable', label: 'Is Deliverable', type: 'boolean' },
    ],
  },
};

export default validateEmail;
