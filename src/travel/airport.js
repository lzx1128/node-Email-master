'use strict';

const express = require('express');
const { proxyError, relay, requestTimeout, upstreamUrl } = require('./proxy');

const UPSTREAM_URL = 'http://172.104.79.65/api/suggest';

function createAirportSuggestRouter(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  const router = express.Router();
  const timeoutMs = requestTimeout();

  router.get('/suggest', async (req, res) => {
    try {
      const url = upstreamUrl(UPSTREAM_URL);
      const queryIndex = req.originalUrl.indexOf('?');
      if (queryIndex !== -1) {
        for (const [name, value] of new URLSearchParams(req.originalUrl.slice(queryIndex + 1))) {
          url.searchParams.append(name, value);
        }
      }
      const response = await fetchImpl(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(timeoutMs),
      });
      res.set('Cache-Control', 'no-store');
      return relay(response, res);
    } catch (error) {
      return proxyError(res, error);
    }
  });

  return router;
}

module.exports = createAirportSuggestRouter;
