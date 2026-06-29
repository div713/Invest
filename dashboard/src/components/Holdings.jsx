import { useEffect, useState } from "react";

import axios from "axios";
import api from "../api";

const Holdings = () => {
  const [allHoldings, setallHoldings] = useState([]);

  useEffect(() => {
    api.get("/allHoldings").then((res) => {
      setallHoldings(res.data);
    });
  }, []);
  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + Number(stock.avg) * Number(stock.qty),
    0,
  );

  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + Number(stock.price) * Number(stock.qty),
    0,
  );

  const totalPnL = currentValue - totalInvestment;

  const totalPnLPercentage =
    totalInvestment === 0 ? 0 : (totalPnL / totalInvestment) * 100;
  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const curvalue = stock.price * stock.qty;
              const isProfit = (curvalue - stock.avg) * stock.qty >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg}</td>
                  <td>{stock.price}</td>
                  <td>{curvalue}</td>
                  <td className={profClass}>
                    {(stock.price - stock.avg) * stock.qty}
                  </td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.net}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)} </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toFixed(2)} </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            ₹{totalPnL.toFixed(2)} ({totalPnLPercentage.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>
    </>
  );
};

export default Holdings;
