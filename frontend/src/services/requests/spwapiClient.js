import axios from 'axios';

const RUNTIME = (typeof window !== 'undefined' && window.__ENV__) || {};
const SPWAPI_URL = RUNTIME.SPWAPI_URL || import.meta.env.VITE_SPWAPI_URL || 'https://tradeverse-api-management.azure-api.net/api/spwapi';
const APPID = RUNTIME.APPID || import.meta.env.VITE_APPID || 'primary';
const VER = RUNTIME.VER || import.meta.env.VITE_VER || 'v1';

const spwapi = axios.create({
  baseURL: SPWAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const sha256Hex = async (input) => {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return toHex(digest);
  }
  throw new Error('WebCrypto is not available');
};

const getAppKey = () => {
  const fromRuntime = RUNTIME.APPKEY || import.meta.env.VITE_APPKEY;
  if (fromRuntime) return fromRuntime;
  try {
    return localStorage.getItem('spwapiAppKey') || '';
  } catch {
    return '';
  }
};

spwapi.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};
  config.headers.APPID = config.headers.APPID || APPID;
  config.headers.VER = config.headers.VER || VER;
  config.headers.TS = config.headers.TS || String(Math.floor(Date.now() / 1000));
  if (!config.headers.SIG) {
    const appKey = getAppKey();
    const sigPayload = `${config.headers.APPID}${config.headers.TS}${config.headers.VER}${appKey}`;
    config.headers.SIG = await sha256Hex(sigPayload);
  }

  const token = localStorage.getItem('spwapiToken');
  if (token) {
    config.headers.XAUTH = token;
  }
  return config;
});

export default spwapi;

