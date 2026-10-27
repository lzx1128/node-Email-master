'use strict';

function upstreamUrl(url) {
  return new URL(url);
}

function requestTimeout() {
  return 5000;
}

async function relay(upstreamResponse, res) {
  const contentType = upstreamResponse.headers.get('content-type');
  if (contentType) res.set('Content-Type', contentType);
  const body = Buffer.from(await upstreamResponse.arrayBuffer());
  return res.status(upstreamResponse.status).send(body);
}

function proxyError(res, error) {
  console.error('API request failed:', error.message);
  return res.status(500).json({ success: false, message: 'Request failed' });
}

module.exports = { proxyError, relay, requestTimeout, upstreamUrl };
