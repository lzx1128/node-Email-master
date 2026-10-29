'use strict';

const express = require('express');
const { proxyError, relay, upstreamUrl } = require('./proxy');

const UPSTREAM_URL = 'http://demo.oneflya.com:4055/price?action=baggage&www=www';

function createBaggageRouter(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  const router = express.Router();

  router.post('/get_baggages', async (req, res) => {
    try {
      const response = await fetchImpl(upstreamUrl(UPSTREAM_URL), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(30000),
      });
      return relay(response, res);
    } catch (error) {
      return proxyError(res, error);
    }
  });

  return router;
}

module.exports = createBaggageRouter;
