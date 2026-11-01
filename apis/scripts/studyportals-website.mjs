const unwrap = value => value && typeof value === 'object' && 'func' in value ? value.func : value;
export function readProgrammeWebsite(value) {
  const referral = unwrap(value);
  const tracking = unwrap(referral?.getTracking);
  // Tracking descriptions contain the supplied destination; getUrl is often a relative tracking URL.
  for (const candidate of [tracking?.getDescription, referral?.getUrl]) {
    const value = unwrap(candidate);
    if (typeof value !== 'string') continue;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password || /(^|\.)(prtl\.co|mastersportal\.com|phdportal\.com)$/.test(url.hostname) || url.hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname) || url.hostname.includes(':')) continue;
      for (const key of [...url.searchParams.keys()]) if (key.startsWith('utm_')) url.searchParams.delete(key);
      return url.toString();
    } catch { /* No destination supplied. */ }
  }
  return null;
}
