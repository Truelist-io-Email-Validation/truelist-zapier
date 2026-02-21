import * as zapier from 'zapier-platform-core';
import App from '../index';

const appTester = zapier.createAppTester(App);

describe('authentication', () => {
  beforeAll(() => {
    zapier.tools.env.inject();
  });

  it('should authenticate with a valid API key', async () => {
    const bundle = {
      authData: {
        api_key: process.env.TRUELIST_API_KEY || 'test-key',
      },
    };

    // This test requires a valid TRUELIST_API_KEY env var to pass against
    // the live API. In CI, we only verify the build compiles.
    if (!process.env.TRUELIST_API_KEY) {
      return;
    }

    const response = await appTester(App.authentication.test, bundle);
    expect(response).toHaveProperty('email');
    expect(response).toHaveProperty('name');
    expect(response).toHaveProperty('uuid');
  });

  it('should have the correct auth type', () => {
    expect(App.authentication.type).toBe('custom');
  });

  it('should require an api_key field', () => {
    const fields = App.authentication.fields;
    const apiKeyField = fields.find((f: { key: string }) => f.key === 'api_key');
    expect(apiKeyField).toBeDefined();
    expect(apiKeyField!.required).toBe(true);
  });
});
