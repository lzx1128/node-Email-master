'use strict';

const express = require('express');
const { proxyError, relay, upstreamUrl } = require('./proxy');

const UPSTREAM_URL = 'http://demo.oneflya.com:4055/price?action=search&www=www&version=v2';

function createSearchRouter(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');

  const router = express.Router();

  router.get('/search', async (req, res) => {
    try {
      const body = req.query;
      const response = await fetchImpl(upstreamUrl(UPSTREAM_URL), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: body.cid || 'oneflydemo',
          fromCity: (body.depCity || body.fromCity).toUpperCase(),
          toCity: (body.arrCity || body.toCity).toUpperCase(),
          fromDate: (body.depDate || body.fromDate).replace(/-/g, ''),
          retDate: body.type === 'roundtrip' ? (body.retDate || '').replace(/-/g, '') : '',
          adultNumber: body.adultNumber || body.adult || '1',
          childNumber: body.childNumber || body.child || '0',
          infantNumber: body.infantNumber || body.infant || '0',
        }),
        signal: AbortSignal.timeout(30000),
      });
      res.set('Cache-Control', 'no-store');
      return relay(response, res);
    } catch (error) {
      return proxyError(res, error);
    }
  });

  return router;
}

module.exports = createSearchRouter;
