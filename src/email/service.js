'use strict';

const nodemailer = require('nodemailer');
const renderEmail = require('./renderer');

let transporter;
const SMTP_HOST = 'email-smtp.eu-north-1.amazonaws.com';
const SMTP_PORT = 465;

function getTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS must be configured');
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

module.exports = async function sendEmail(data) {
  return getTransporter().sendMail({
    from: process.env.MAIL_FROM || 'Onefly <support@onefly.com>',
    to: process.env.MAIL_TO || 'sales@oneflya.com',
    replyTo: data.emailAddress,
    subject: `Onefly Website Inquiry - ${data.companyName} - ${data.firstName} ${data.lastName}`,
    html: renderEmail(data),
  });
};
