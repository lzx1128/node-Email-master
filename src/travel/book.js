'use strict';

const express = require('express');
const { proxyError, relay, upstreamUrl } = require('./proxy');

const UPSTREAM_URL = 'http://demo.oneflya.com:4055/price?action=verify&www=www';

function createBookRouter(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  const router = express.Router();

  router.post('/book', async (req, res) => {
    try {
      const body = req.body || {};
      const url = upstreamUrl(UPSTREAM_URL);
      url.searchParams.set('cur', body.currency || 'USD');

      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: body.cid || 'oneflydemo',
          tripType: body.type === 'oneway' ? '1' : '2',
          routing: typeof body.data === 'string' ? JSON.parse(body.data) : body.data,
          adultNumber: body.adultNumber || body.adult,
          childNumber: body.childNumber || body.child || 0,
          infantNumber: body.infantNumber || body.infant || 0,
        }),
        signal: AbortSignal.timeout(30000),
      });
      return relay(response, res);
    } catch (error) {
      return proxyError(res, error);
    }
  });

  return router;
}

module.exports = createBookRouter;
