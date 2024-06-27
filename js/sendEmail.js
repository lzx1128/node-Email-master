const nodemailer = require('nodemailer');
const userEmail = require('../userEmail.json');
const renderEmail = require('./renderEmail'); 

// 配置 SMTP 客户端
const transporter = nodemailer.createTransport({
  host: "smtp.163.com",
  secureConnection: true,
  port: 465,
  secureConnection: true,
  auth: {
    user: userEmail.user,
    pass: userEmail.pass,
  },
});
// const transporter = nodemailer.createTransport({
//   host: "email-smtp.eu-north-1.amazonaws.com",
//   //port: 25,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: userEmail.user, // generated ethereal user
//     pass: userEmail.pass // generated ethereal password
//   },
// });
/**
 * 发送邮件的函数
 * @param {Object} mailOptions - 包含邮件配置的对象
 */
function sendEmail(mailOptions,data) {
  //data 包含邮件模板需要的数据
  const htmlContent = renderEmail(data); // 使用 renderEmail 模块渲染 HTML

  // 更新邮件选项，添加渲染后的 HTML 内容
  mailOptions.html = htmlContent;

  // 发送邮件
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      return;
    }
    console.log('邮件发送成功:', info.response);
  });
}


module.exports = sendEmail;