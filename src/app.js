'use strict';

const cors = require('cors');
const express = require('express');
const riskGate = require('./middleware/risk');
const createEmailRouter = require('./email/route');
const sendEmail = require('./email/service');
const createAirportSuggestRouter = require('./travel/airport');
const createAirlineQueryRouter = require('./travel/airline');
const createSearchRouter = require('./travel/search');
const createSeatRouter = require('./travel/seat');
const createBaggageRouter = require('./travel/baggage');
const createBookRouter = require('./travel/book');

function createApp(options = {}) {
  const app = express();
  const emailSender = options.emailSender || sendEmail;
  const requestGuard = options.riskGate || riskGate;

  app.disable('x-powered-by');
  app.set('trust proxy', false);
  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '32kb' }));
  app.use(createAirportSuggestRouter(options.travelFetch));
  app.use(createAirlineQueryRouter(options.travelFetch));
  app.use(createSearchRouter(options.travelFetch));
  app.use(createSeatRouter(options.travelFetch));
  app.use(createBaggageRouter(options.travelFetch));
  app.use(createBookRouter(options.travelFetch));
  app.use(requestGuard, createEmailRouter(emailSender, options.emailGuard));

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return res.status(400).json({ success: false, message: '请求内容不是有效的 JSON' });
    }
    console.error('服务接口异常:', error);
    return res.status(500).json({ success: false, message: '服务器内部错误' });
  });

  return app;
}

module.exports = { createApp };
