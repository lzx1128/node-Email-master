const sendEmail = require('../sendEmail');

// 邮件数据
const data = {
  "summary": {
    "passengerName": "OPHATWATTHANA/SIRIPHON",
    "passengerEmail": "e-ticketonefly@travelokaflightax.com",
    "route": "SNO-DMK",
    "price": 24.06,
    "currency": "USD",
    "airline": "airasia",
    "seatPrice": "0.00",
    "baggagePrice": "0.00",
    "baggage": "Checked Bag (20kg)",
    "totalPrice": "1877.94 NOK",
    "flightNo": "FD3511",
    "dep": "SNO",
    "arr": "DMK",
    "deptCity": "Oslo",
    "arrCity": "Gdańsk",
    "depTime": "09:10",
    "arrTime": "10:10",
    "day": 5,
    "month": "Jul",
    "hour": 1,
    "minute": 0,
    "back": false,
    "fullDepTime": "2024-07-05 09:10",
    "fullArrTime": "2024-07-05 10:10",
    "seatNo": "1A"
  }
}

// 邮件选项
const mailOptions = {
  from: '"Daytravel Itinerary" <flightnotice@daytravel.com>', // sender address
  to: 'lzx981128@gmail.com', // ,          /*waterlucas3@gmail.com,*/  /*"jack_may2021@hotmail.com"*, /* "jack_may2021@hotmail.com" || "604672357@qq.com" ||  "no3weiwwei@gmail.com", // list of receivers*/
  subject: "Your booking has been confirmed", // Subject line   // 邮件主题
  data: data, //                     // 邮件内容，使用渲染后的 HTML
};

// 发送邮件
sendEmail(mailOptions);