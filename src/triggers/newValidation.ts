import { Bundle, ZObject } from 'zapier-platform-core';

const perform = async (_z: ZObject, _bundle: Bundle) => {
  // Placeholder trigger: Zapier requires at least one trigger.
  // Returns a static sample so the app passes validation.
  return [
    {
      id: 'sample-1',
      email: 'user@example.com',
      state: 'ok',
      subState: 'email_ok',
      validated_at: new Date().toISOString(),
    },
  ];
};

const newValidation = {
  key: 'new_validation',
  noun: 'Validation',
  display: {
    label: 'New Validation (Placeholder)',
    description:
      'Placeholder trigger. Use the Validate Email action to verify addresses.',
    hidden: true,
  },
  operation: {
    perform,
    sample: {
      id: 'sample-1',
      email: 'user@example.com',
      state: 'ok',
      subState: 'email_ok',
      validated_at: '2026-02-20T00:00:00.000Z',
    },
  },
};

export default newValidation;
