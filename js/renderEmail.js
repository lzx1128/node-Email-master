const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

/**
 * 渲染 EJS 模板为 HTML 字符串
 * @param {Object} data - 模板数据
 * @returns {String} 渲染后的 HTML 字符串
 */
function renderEmail(data) {
  // 读取EJS模板文件
  const templatePath = path.join(__dirname, '..', 'templates', 'email-template.ejs');
  const template = fs.readFileSync(templatePath, 'utf8');

  // 使用EJS渲染模板
  const renderedHTML = ejs.render(template, data);

  return renderedHTML;
}

module.exports = renderEmail;