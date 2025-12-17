import { getManagedEnvironmentConfig } from '../environment';

describe('getManagedEnvironmentConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {};
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return config with required environment variables', () => {
    process.env.DT_MANAGED_ENVIRONMENT = 'my-env-id';
    process.env.DT_API_ENDPOINT_URL = 'https://my-api-endpoint.com';
    process.env.DT_DYNATRACE_URL = 'https://my-dashboard-endpoint.com';
    process.env.DT_MANAGED_API_TOKEN = 'my-api-token';

    const config = getManagedEnvironmentConfig();

    expect(config).toEqual({
      environmentId: 'my-env-id',
      apiUrl: 'https://my-api-endpoint.com/e/my-env-id',
      dashboardUrl: 'https://my-dashboard-endpoint.com/e/my-env-id',
      apiToken: 'my-api-token',
    });
  });

  it('should remove trailing slash from environment URL', () => {
    process.env.DT_MANAGED_ENVIRONMENT = 'my-env-id/';
    process.env.DT_API_ENDPOINT_URL = 'https://my-api-endpoint.com/';
    process.env.DT_DYNATRACE_URL = 'https://my-dashboard-endpoint.com/';
    process.env.DT_MANAGED_API_TOKEN = 'my-api-token';

    const config = getManagedEnvironmentConfig();

    expect(config).toEqual({
      environmentId: 'my-env-id',
      apiUrl: 'https://my-api-endpoint.com/e/my-env-id',
      dashboardUrl: 'https://my-dashboard-endpoint.com/e/my-env-id',
      apiToken: 'my-api-token',
    });
  });

  it('should default dashboard url to api base url', () => {
    process.env.DT_MANAGED_ENVIRONMENT = 'my-env-id';
    process.env.DT_API_ENDPOINT_URL = 'https://my-endpoint.com';
    process.env.DT_MANAGED_API_TOKEN = 'my-api-token';

    const config = getManagedEnvironmentConfig();

    expect(config).toEqual({
      environmentId: 'my-env-id',
      apiUrl: 'https://my-endpoint.com/e/my-env-id',
      dashboardUrl: 'https://my-endpoint.com/e/my-env-id',
      apiToken: 'my-api-token',
    });
  });

  it('should throw error when DT_MANAGED_ENVIRONMENT is missing', () => {
    process.env.DT_API_ENDPOINT_URL = 'https://my-api-endpoint.com/';
    process.env.DT_MANAGED_API_TOKEN = 'my-api-token';

    expect(() => getManagedEnvironmentConfig()).toThrow('DT_MANAGED_ENVIRONMENT is required');
  });

  it('should throw error when DT_API_ENDPOINT_URL is missing', () => {
    process.env.DT_MANAGED_ENVIRONMENT = 'my-env-id';
    process.env.DT_MANAGED_API_TOKEN = 'my-api-token';

    expect(() => getManagedEnvironmentConfig()).toThrow('DT_API_ENDPOINT_URL is required');
  });

  it('should throw error when DT_MANAGED_API_TOKEN is missing', () => {
    process.env.DT_MANAGED_ENVIRONMENT = 'my-env-id';
    process.env.DT_API_ENDPOINT_URL = 'https://my-endpoint.com';

    expect(() => getManagedEnvironmentConfig()).toThrow('DT_MANAGED_API_TOKEN is required');
  });
});
