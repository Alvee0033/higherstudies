import 'dotenv/config';

// Separate API credentials from the optional contact email. Values are read at
// request time so a restarted worker picks up .env changes without a migration.
function parseKeys() {
  const listed = (process.env.OPENALEX_API_KEYS || '').split(/[\n,;]+/);
  const numbered = Object.entries(process.env)
    .filter(([name]) => /^OPENALEX_API_KEY(?:_[1-9]\d*)?$/.test(name))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value || '');
  return [...new Set([...numbered, ...listed].map(value => value.trim()).filter(value => value && !value.includes('@')))];
}

const keyStatus = new Map();
let nextIndex = 0;
export class OpenAlexKeyCooldownError extends Error {
  constructor(waitUntil) {
    super('All configured OpenAlex API keys are cooling down; checkpoint preserved');
    this.name = 'OpenAlexKeyCooldownError';
    this.waitUntil = waitUntil;
  }
}
export function configuredOpenAlexKeyCount() { return parseKeys().length; }
export function nextOpenAlexKeyAvailableAt() {
  const keys = parseKeys();
  if (!keys.length || getAvailableKeys().length) return null;
  return new Date(Math.min(...keys.map(key => keyStatus.get(key) || Date.now())));
}
export function getAvailableKeys() {
  const now = Date.now();
  return parseKeys().filter(key => (keyStatus.get(key) || 0) <= now);
}
export function getCurrentOpenAlexKey() {
  const keys = getAvailableKeys();
  if (!keys.length) return null;
  const key = keys[nextIndex % keys.length];
  nextIndex += 1;
  return key;
}
export function markKeyExhausted(key, retryAfterSeconds = 3600) {
  if (!key) return;
  const seconds = Number(retryAfterSeconds);
  const until = Date.now() + Math.max(60_000, (Number.isFinite(seconds) && seconds > 0 ? seconds : 3600) * 1000);
  keyStatus.set(key, until);
  console.log(`[OpenAlex Key Manager] A credential is unavailable until ${new Date(until).toISOString()}`);
}
export function applyOpenAlexAuth(urlObj, forcedKey = undefined) {
  const key = forcedKey === undefined ? getCurrentOpenAlexKey() : forcedKey;
  urlObj.searchParams.delete('api_key');
  if (key) urlObj.searchParams.set('api_key', key);
  if (process.env.OPENALEX_MAILTO?.trim()) urlObj.searchParams.set('mailto', process.env.OPENALEX_MAILTO.trim());
  return key;
}
export async function fetchWithKeyRotation(urlInput, init = {}) {
  const attempts = Math.max(configuredOpenAlexKeyCount(), 1);
  let lastResponse;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const key = getCurrentOpenAlexKey();
    if (configuredOpenAlexKeyCount() && !key) break;
    const url = new URL(urlInput, 'https://api.openalex.org');
    applyOpenAlexAuth(url, key);
    const response = await fetch(url, {
      ...init,
      headers: { Accept: 'application/json', 'User-Agent': 'HigherStudyCollector/1.0', ...init.headers },
    });
    lastResponse = response;
    if (![401, 403, 429].includes(response.status) || !key) return response;
    markKeyExhausted(key, Number(response.headers.get('retry-after')) || 3600);
  }
  if (lastResponse) return lastResponse;
  throw new OpenAlexKeyCooldownError(nextOpenAlexKeyAvailableAt());
}
export function openAlexUrl(path, params = {}) {
  const url = new URL(path, 'https://api.openalex.org');
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  return url.toString();
}
