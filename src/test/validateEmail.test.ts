import * as zapier from 'zapier-platform-core';
import App from '../index';

const appTester = zapier.createAppTester(App);

describe('validate email action', () => {
  beforeAll(() => {
    zapier.tools.env.inject();
  });

  it('should validate an email address', async () => {
    const bundle = {
      authData: {
        api_key: process.env.TRUELIST_API_KEY || 'test-key',
      },
      inputData: {
        email: 'user@example.com',
      },
    };

    // This test requires a valid TRUELIST_API_KEY env var to pass against
    // the live API. In CI, we only verify the build compiles.
    if (!process.env.TRUELIST_API_KEY) {
      return;
    }

    const result = await appTester(
      App.creates.validate_email.operation.perform,
      bundle
    );
    expect(result).toHaveProperty('email', 'user@example.com');
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('sub_state');
    expect(result).toHaveProperty('is_valid');
    expect(result).toHaveProperty('is_deliverable');
    expect(['valid', 'invalid', 'risky', 'unknown']).toContain(result.state);
  });

  it('should be registered as a create action', () => {
    expect(App.creates.validate_email).toBeDefined();
    expect(App.creates.validate_email.key).toBe('validate_email');
  });

  it('should have correct sample data', () => {
    const sample = App.creates.validate_email.operation.sample;
    expect(sample).toHaveProperty('email');
    expect(sample).toHaveProperty('state');
    expect(sample).toHaveProperty('is_valid');
    expect(sample).toHaveProperty('is_deliverable');
  });

  it('should require an email input field', () => {
    const fields = App.creates.validate_email.operation.inputFields;
    const emailField = fields.find((f: { key: string }) => f.key === 'email');
    expect(emailField).toBeDefined();
    expect(emailField!.required).toBe(true);
  });
});
