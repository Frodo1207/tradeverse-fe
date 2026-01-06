import axios from 'axios';

const RUNTIME = (typeof window !== 'undefined' && window.__ENV__) || {};
const SPWAPI_URL = import.meta.env.VITE_SPWAPI_URL || RUNTIME.SPWAPI_URL || 'https://tradeverse-api-management.azure-api.net/api/spwapi';
const APPID = 'primary';
const VER = 'v1';

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
  try {
    const raw = '9882768ab9183051ea9ce724d1e6b645a0581492a5bbbf9b23ca88a3d8051f7e';
    const value = String(raw || '').trim();
    if (/^0x[a-fA-F0-9]{40}$/.test(value)) return '';
    return value;
  } catch {
    return '';
  }
};

spwapi.interceptors.request.use(async (config) => {
  config.headers = config.headers || {};
  config.headers.APPID = config.headers.APPID || APPID;
  config.headers.VER = config.headers.VER || VER;
  config.headers.TS = config.headers.TS || String(Math.floor(Date.now() / 1000));
  const appKey = getAppKey();
  if (!appKey) {
    throw new Error('Missing SPWAPI APPKEY (set VITE_SPWAPI_APPKEY or window.__ENV__.SPWAPI_APPKEY).');
  }

  const sigPayload = `${config.headers.APPID}${config.headers.TS}${config.headers.VER}${appKey}`;
  const sig = await sha256Hex(sigPayload);
  config.headers.SIG = config.headers.SIG || sig;

  const nextParams = (config.params && typeof config.params === 'object' && !Array.isArray(config.params))
    ? { ...config.params }
    : {};
  nextParams.key = nextParams.key || appKey;
  nextParams.sig = nextParams.sig || sig;
  nextParams.appid = nextParams.appid || config.headers.APPID;
  nextParams.ver = nextParams.ver || config.headers.VER;
  nextParams.ts = nextParams.ts || config.headers.TS;
  config.params = nextParams;

  const token = localStorage.getItem('spwapiToken');
  if (token) {
    config.headers.XAUTH = token;
  }
  return config;
});

export default spwapi;
