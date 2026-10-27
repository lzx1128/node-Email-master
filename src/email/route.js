'use strict';

const express = require('express');
const defaultEmailGuard = require('./guard');

const requiredFields = ['firstName', 'lastName', 'companyName', 'emailAddress'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmailForm(req, res, next) {
  const data = {
    firstName: clean(req.body?.firstName),
    lastName: clean(req.body?.lastName),
    companyName: clean(req.body?.companyName),
    country: clean(req.body?.country),
    emailAddress: clean(req.body?.emailAddress).toLowerCase(),
    telephone: clean(req.body?.telephone),
    description: clean(req.body?.description),
  };

  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: '请填写所有必填项',
      fields: missingFields,
    });
  }
  if (!emailPattern.test(data.emailAddress)) {
    return res.status(400).json({ success: false, message: '邮箱格式不正确', fields: ['emailAddress'] });
  }

  req.emailData = data;
  return next();
}

function createEmailRouter(sendEmail, guard = defaultEmailGuard) {
  const router = express.Router();

  router.post('/send-email', validateEmailForm, guard, async (req, res) => {
    try {
      await sendEmail(req.emailData);
      return res.json({ success: true, message: '邮件发送成功' });
    } catch (error) {
      console.error('邮件发送失败:', error.message);
      return res.status(502).json({ success: false, message: '邮件发送失败' });
    }
  });

  return router;
}

module.exports = createEmailRouter;
