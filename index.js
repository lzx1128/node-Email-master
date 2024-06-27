const { name } = require("ejs");
const sendEmail = require("./js/sendEmail");
const data = {
  summary: {
    name: "Widyani/Henny",
    gender: "F",
    depCity: "Gdańsk",
    arrCity: "Oslo (Torp)",
    reservation: 'XLFEQZ',
    totalPrice: 24.04,
    currency: "USD",
    airline: "airasia",
  },
  passengers: [
    {
      name: "Hemmun/Klaxon",
      gender: "F",
      outbound: {
        flightDirection: "Flight out:",
        flightNumber: "FR3278",
        baggageInfo: "Checked Bag (20kg)",
        setNo: "2A"
      },
      backbound: {
        flightDirection: "Flight back:",
        flightNumber: "FR3279",
        baggageInfo: "Checked Bag (20kg)",
        setNo: "2B"
      }
    },
    {
      name: "Hemmun/Klaxon",
      gender: "F",
      outbound: {
        flightDirection: "Flight out:",
        flightNumber: "FR3278",
        baggageInfo: "Checked Bag (20kg)",
        setNo: "2A"
      },
      backbound: {
        flightDirection: "Flight back:",
        flightNumber: "FR3279",
        baggageInfo: "Checked Bag (20kg)",
        setNo: "2B"
      }
    }
  ],

  // 可以根据需要添加更多的乘客信息

  segments: [
    {
      flightNo: "FD3306",
      dep: "DMK",
      arr: "PHS",
      depTime: "14:40",
      arrTime: "15:40",
      year: 24,
      day: 1,
      month: "Jul",
      hour: 1,
      minute: 0,
      weekday: "Monday",
      seatNo: "1A",
      depCity: "Gdańsk",
      arrCity: " Oslo (Torp)",
      baggage: "Checked Bag (20kg)",
      fullDepTime: "2024-07-01 14:40",
      fullArrTime: "2024-07-01 15:40",
      back: false,
      airline: "airasia",
    },
    {
      flightNo: "FD3306",
      dep: "DMK",
      arr: "PHS",
      depTime: "14:40",
      arrTime: "15:40",
      year: 24,
      day: 1,
      month: "Jul",
      hour: 1,
      minute: 0,
      weekday: "Monday",
      seatNo: "1A",
      depCity: "Gdańsk",
      arrCity: " Oslo (Torp)",
      baggage: "Checked Bag (20kg)",
      fullDepTime: "2024-07-01 14:40",
      fullArrTime: "2024-07-01 15:40",
      back: false,
      airline: "airasia",
    },
  ],
};
// 指定EJS模板文件路径

// 使用EJS渲染函数渲染JSON数据

// 邮件选项
const mailOptions = {
  from: "17634328154@163.com", // sender address
  subject: "Hello sir",
  to: '2735772872@qq.com', // ,   "2735772872@qq.com"       /*waterlucas3@gmail.com,*/  /*"jack_may2021@hotmail.com"*, /* "jack_may2021@hotmail.com" || "604672357@qq.com" ||  "no3weiwwei@gmail.com", // list of receivers*/
  // from: '"Daytravel Itinerary" <flightnotice@daytravel.com>', // sender address
  // to: "lzx981128@gmail.com", // ,          /*waterlucas3@gmail.com,*/  /*"jack_may2021@hotmail.com"*, /* "jack_may2021@hotmail.com" || "604672357@qq.com" ||  "no3weiwwei@gmail.com", // list of receivers*/
  // subject: "Your booking has been confirmed",
};

// 发送邮件
sendEmail(mailOptions, data);
