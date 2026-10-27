'use strict';

const crypto = require('crypto');

const MAX_PER_HOUR = 5;
const MIN_INTERVAL_SECONDS = 30;
const DUPLICATE_WINDOW_SECONDS = 300;
const values = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, item] of values) {
    if (item.expiresAt <= now) values.delete(key);
  }
}, 60_000).unref();

function get(key) {
  const item = values.get(key);
  if (!item || item.expiresAt <= Date.now()) {
    values.delete(key);
    return null;
  }
  return item.value;
}

function set(key, value, ttlSeconds) {
  values.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

function emailGuard(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Math.floor(Date.now() / 1000);
  const lastSentAt = get(`email:last:${ip}`);

  if (lastSentAt && now - lastSentAt < MIN_INTERVAL_SECONDS) {
    const retryAfter = MIN_INTERVAL_SECONDS - (now - lastSentAt);
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({ success: false, message: '请稍后再发送', retryAfter });
  }

  const hourKey = `email:count:${ip}:${Math.floor(now / 3600)}`;
  const count = (get(hourKey) || 0) + 1;
  set(hourKey, count, 3700);
  if (count > MAX_PER_HOUR) {
    res.set('Retry-After', '3600');
    return res.status(429).json({ success: false, message: '已达到每小时发送上限', retryAfter: 3600 });
  }

  const bodyHash = crypto.createHash('sha256').update(JSON.stringify(req.body || {})).digest('hex');
  const duplicateKey = `email:duplicate:${ip}:${bodyHash}`;
  if (get(duplicateKey)) {
    return res.status(429).json({ success: false, message: '请勿重复提交相同内容' });
  }

  set(duplicateKey, true, DUPLICATE_WINDOW_SECONDS);
  set(`email:last:${ip}`, now, MIN_INTERVAL_SECONDS + 5);
  return next();
}

module.exports = emailGuard;
