'use strict';

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const templatePath = path.join(__dirname, 'inquiry.ejs');
const template = ejs.compile(fs.readFileSync(templatePath, 'utf8'), { filename: templatePath });

module.exports = function renderEmail(data) {
  return template(data);
};
