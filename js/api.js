const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// 硬编码的JSON数据
const data = {
  
  segments: [
    {
      id: 1,
      flightNo: "VY6107",
      dep: "FCO",
      arr: "BCN",
      depTime: "22:35",
      arrTime: "00:25",
      fullDepTime: "2024-06-30 22:35",
      fullArrTime: "2024-07-01 00:25",
      airline: "vy",
      aircraft: "A321",
      seats: "18",
      price: "1200",
      baggage: "10kg",
      depCity: "FCO",
      arrCity: "BCN",
      depDate: "2024-06-30",
      arrDate: "2024-07-01",
      seatNo: "1A",
      birthday: "19900102",
      name: "asdf/zzxcv",
      gender: "M",
      nationality: "DZ"

    }
  ]
  
};

// 允许跨域资源共享
app.use(cors());

// 创建一个API端点
app.get('/api/flight', (req, res) => {

  //增加跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // 响应数据
  res.json(data);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});