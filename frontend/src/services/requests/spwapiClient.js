import axios from 'axios';

const SPWAPI_URL = 'https://tradeverse-api-management.azure-api.net/api/spwapi';
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
  const appKey = getAppKey();
  if (!appKey) {
    throw new Error('Missing SPWAPI APPKEY (localStorage spwapiAppKey).');
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
  console.log('Request Config:', config);
  return config;
});

export default spwapi;
