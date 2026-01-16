export interface ManagedEnvironmentConfig {
  environmentId: string;
  apiUrl: string;
  dashboardUrl: string;
  apiToken: string;
}

export function getManagedEnvironmentConfig(): ManagedEnvironmentConfig {
  // Support both Managed format and Playground/Classic API format
  // If DT_ENVIRONMENT is set (Playground format), use it directly
  const dtEnvironment = process.env.DT_ENVIRONMENT;
  
  if (dtEnvironment) {
    // Playground/Classic API format: https://{env-id}.live.dynatrace.com
    // Extract environment ID from URL
    const urlMatch = dtEnvironment.match(/https?:\/\/([^.]+)\.(live|apps)\.(dynatrace|dynatracelabs)\.com/);
    if (urlMatch) {
      const environmentId = urlMatch[1];
      const apiToken = process.env.DT_MANAGED_API_TOKEN || process.env.DT_CLASSIC_API_TOKEN || process.env.DT_API_TOKEN || process.env.DT_PERSONAL_ACCESS_TOKEN;
      
      if (!apiToken) {
        throw new Error('DT_MANAGED_API_TOKEN, DT_CLASSIC_API_TOKEN, DT_API_TOKEN, or DT_PERSONAL_ACCESS_TOKEN is required when using DT_ENVIRONMENT');
      }
      
      // For Playground/Classic APIs, URL is already the full environment URL (no /e/{id} needed)
      const apiUrl = dtEnvironment.replace(/\/$/, '');
      const dashboardUrl = apiUrl;
      
      return {
        environmentId: environmentId,
        apiUrl: apiUrl,
        dashboardUrl: dashboardUrl,
        apiToken: apiToken,
      };
    }
  }
  
  // Original Managed format
  const environmentIdRaw = process.env.DT_MANAGED_ENVIRONMENT;
  const apiUrlRaw = process.env.DT_API_ENDPOINT_URL;
  const dashboardUrlRaw = process.env.DT_DYNATRACE_URL;
  const apiToken = process.env.DT_MANAGED_API_TOKEN;

  if (!environmentIdRaw) {
    throw new Error('DT_MANAGED_ENVIRONMENT is required (or use DT_ENVIRONMENT for Playground/Classic APIs)');
  }

  if (!apiUrlRaw) {
    throw new Error('DT_API_ENDPOINT_URL is required (or use DT_ENVIRONMENT for Playground/Classic APIs)');
  }

  if (!apiToken) {
    throw new Error('DT_MANAGED_API_TOKEN is required (or use DT_CLASSIC_API_TOKEN/DT_API_TOKEN/DT_PERSONAL_ACCESS_TOKEN with DT_ENVIRONMENT)');
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
