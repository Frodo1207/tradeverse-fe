// Runtime Environment Configuration
// This file is loaded by index.html and allows runtime configuration of the application.
// For local development, it defaults to localhost.
// For production (e.g. Vercel), this should be empty or contain production values injected by CI/CD.

(function() {
  window.__ENV__ = window.__ENV__ || {};
  
  // Only set default local API URL if we are on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.__ENV__.API_URL = '/api';
    window.__ENV__.SPWAPI_URL = 'https://tradeverse-api-management.azure-api.net/api/spwapi';
  }
  
  // You can also inject values here during deployment script
})();
