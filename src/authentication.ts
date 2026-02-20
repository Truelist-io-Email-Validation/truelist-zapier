import { Bundle, ZObject } from 'zapier-platform-core';

const test = async (z: ZObject, bundle: Bundle) => {
  const response = await z.request({
    url: 'https://api.truelist.io/api/v1/account',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`,
      Accept: 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
      'Invalid API key. Find yours at https://truelist.io/dashboard',
      'AuthenticationError',
      response.status
    );
  }

  return response.json;
};

const authentication = {
  type: 'custom' as const,
  test,
  fields: [
    {
      key: 'api_key',
      label: 'API Key',
      type: 'string',
      required: true,
      helpText:
        'Your Truelist API key from [truelist.io/dashboard](https://truelist.io/dashboard)',
    },
  ],
  connectionLabel: (z: ZObject, bundle: Bundle) => {
    return `Truelist (${bundle.inputData.email})`;
  },
};

export default authentication;
