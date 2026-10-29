'use strict';

const express = require('express');
const { proxyError, relay, requestTimeout, upstreamUrl } = require('./proxy');
const UPSTREAM_URL = 'http://172.233.74.96:8050/webAirline/query';

function createAirlineQueryRouter(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  const router = express.Router();
  const timeoutMs = requestTimeout();

  router.post('/webAirline', async (req, res) => {
    try {
      const url = upstreamUrl(UPSTREAM_URL);
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(timeoutMs),
      });
      return relay(response, res);
    } catch (error) {
      return proxyError(res, error);
    }
  });

  return router;
}

module.exports = createAirlineQueryRouter;
