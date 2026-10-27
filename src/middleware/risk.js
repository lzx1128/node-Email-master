'use strict';

const RPM_SUSPECT = 20;
const RPM_ATTACK = 40;
const MIN_INTERVAL_MS = 2000;
const NONCE_TTL_SECONDS = 300;
const BLOCK_TTL_SECONDS = 3600;

class MemoryStore {
  constructor() {
    this.values = new Map();
    setInterval(() => this.cleanup(), 30_000).unref();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.values) {
      if (item.expiresAt && item.expiresAt <= now) this.values.delete(key);
    }
  }

  get(key) {
    const item = this.values.get(key);
    if (!item || (item.expiresAt && item.expiresAt <= Date.now())) {
      this.values.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlSeconds) {
    this.values.set(key, {
      value: String(value),
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    });
  }

  increment(key, ttlSeconds) {
    const next = (Number(this.get(key)) || 0) + 1;
    this.set(key, next, ttlSeconds);
    return next;
  }
}

const store = new MemoryStore();

function fingerprint(req, ip) {
  const suppliedNonce = req.get('x-request-nonce');
  if (suppliedNonce && /^[\w-]{8,128}$/.test(suppliedNonce)) return suppliedNonce;

  const crypto = require('crypto');
  return crypto
    .createHash('sha256')
    .update(`${ip}|${req.method}|${req.path}|${JSON.stringify(req.body || {})}`)
    .digest('hex');
}

async function riskGate(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const route = `${req.method}:${req.path}`;
  const now = Date.now();

  try {
    if (await store.get(`risk:block:${ip}`)) {
      return res.status(403).json({ success: false, message: '请求已被暂时阻止' });
    }

    const nonceKey = `risk:nonce:${fingerprint(req, ip)}`;
    if (await store.get(nonceKey)) {
      return res.status(429).json({ success: false, message: '请勿重复提交' });
    }
    await store.set(nonceKey, 1, NONCE_TTL_SECONDS);

    const intervalKey = `risk:interval:${ip}:${route}`;
    const lastRequestAt = await store.get(intervalKey);
    if (lastRequestAt && now - Number(lastRequestAt) < MIN_INTERVAL_MS) {
      const retryAfter = Math.ceil((MIN_INTERVAL_MS - (now - Number(lastRequestAt))) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ success: false, message: '请求过于频繁', retryAfter });
    }
    await store.set(intervalKey, now, 65);

    const minute = Math.floor(now / 60_000);
    const requests = await store.increment(`risk:count:${ip}:${minute}`, 65);
    if (requests > RPM_ATTACK) {
      await store.set(`risk:block:${ip}`, 1, BLOCK_TTL_SECONDS);
      return res.status(403).json({ success: false, message: '请求已被暂时阻止' });
    }
    if (requests > RPM_SUSPECT) {
      res.set('Retry-After', '60');
      return res.status(429).json({ success: false, message: '请求过于频繁', retryAfter: 60 });
    }

    return next();
  } catch (error) {
    console.error('[RISK_GATE] Store error, allowing request:', error.message);
    return next();
  }
}

module.exports = riskGate;
