export interface ManagedEnvironmentConfig {
  environmentId: string;
  apiUrl: string;
  dashboardUrl: string;
  apiToken: string;
}

export function getManagedEnvironmentConfig(): ManagedEnvironmentConfig {
  const environmentIdRaw = process.env.DT_MANAGED_ENVIRONMENT;
  const apiUrlRaw = process.env.DT_API_ENDPOINT_URL;
  const dashboardUrlRaw = process.env.DT_DYNATRACE_URL;
  const apiToken = process.env.DT_MANAGED_API_TOKEN;

  if (!environmentIdRaw) {
    throw new Error('DT_MANAGED_ENVIRONMENT is required');
  }

  if (!apiUrlRaw) {
    throw new Error('DT_API_ENDPOINT_URL is required');
  }

  if (!apiToken) {
    throw new Error('DT_MANAGED_API_TOKEN is required');
  }

  let environmentId = environmentIdRaw.replace(/\/$/, ''); // Remove trailing slash
  let apiUrl = apiUrlRaw + (apiUrlRaw.endsWith('/') ? '' : '/') + 'e/' + environmentId;
  let dashboardUrl = dashboardUrlRaw ? dashboardUrlRaw : apiUrlRaw;
  dashboardUrl = dashboardUrl + (dashboardUrl.endsWith('/') ? '' : '/') + 'e/' + environmentId;

  return {
    environmentId: environmentId,
    apiUrl: apiUrl,
    dashboardUrl: dashboardUrl,
    apiToken: apiToken,
  };
}
