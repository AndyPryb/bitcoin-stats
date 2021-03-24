import React, { useState } from "react";
import './App.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

function App() {

  const NOMICS_BASE_URL = "https://api.nomics.com/v1";
  const NOMICS_API_KEY = "ecdf46fb35be6f2d1680fd2979b51180";

  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoString = weekAgo.toISOString().slice(0, 10);

  const [average, setAverage] = useState(0);
  const [info, setInfo] = useState(() => {
    let res = [];
    for (let index = 0; index < 8; index++) {
      res[index] = { date: '', price: 0, pv: 2400, amt: 2400 }
    }
    return res;
  });

  const handleButton = (event) => {
    fetch(`${NOMICS_BASE_URL}/currencies/sparkline?key=${NOMICS_API_KEY}&ids=BTC&start=${weekAgoString}T00%3A00%3A00Z&end=${todayString}T00%3A00%3A00Z`)
      .then(response => response.json())
      .then(data => {
        let res = [];
        let avg = 0;
        let count = 0;
        for (let index = 0; index < data[0].prices.length; index++) {
          let obj = {
            date: data[0].timestamps[index].slice(5, 10).replace("-", "."), price: data[0].prices[index].slice(0, 8), pv: 2400, amt: 2400
          }
          avg += parseInt(obj.price, 10);
          res[index] = obj;
          count++;
        }
        setInfo(res)
        setAverage(avg/count);
      })
  }

  return (
    <div className="App">
      <div>
        <LineChart width={1200} height={500} data={info}>
          <Line type="monotone" dataKey="price" stroke="#8B0000" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
      <div><button className={"btn btn-info"} onClick={() => handleButton()}>GET STATS</button></div>
      <div>average: {average}</div>
    </div>
  );
}

export default App;
