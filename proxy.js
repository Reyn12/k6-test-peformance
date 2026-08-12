// Proxy config lewat env:
//   PROXY_URL=http://user:pass@host:port     → rotating gateway (provider rotate sendiri)
//   PROXY_LIST=http://a:8080,http://b:8080   → rotate manual per request

function parseProxyList() {
  return (__ENV.PROXY_LIST || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function hasProxy() {
  return Boolean(__ENV.PROXY_URL || parseProxyList().length);
}

export function getProxyUrl() {
  const list = parseProxyList();
  if (list.length > 0) {
    return list[(__VU + __ITER) % list.length];
  }
  return __ENV.PROXY_URL || null;
}

export function getProxyParams(extra = {}) {
  const proxyUrl = getProxyUrl();
  if (!proxyUrl) return extra;
  return { ...extra, proxyUrl };
}
