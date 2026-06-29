import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api";
const Summary = () => {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    api.get("/allHoldings").then((res) => {
    setHoldings(res.data);
    })
  });

  const totalInvestment = holdings.reduce(
    (sum, stock) => sum + Number(stock.avg) * Number(stock.qty),
    0,
  );

  const currentValue = holdings.reduce(
    (sum, stock) => sum + Number(stock.price) * Number(stock.qty),
    0,
  );

  const totalPnL = currentValue - totalInvestment;

  const pnlPercent =
    totalInvestment === 0 ? 0 : (totalPnL / totalInvestment) * 100;

  const formatNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(2) + "k";
    return num.toFixed(2);
  };

  return (
    <div className="summary">
      <div className="username">
        <h6>Hi, {localStorage.getItem("username")}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={totalPnL >= 0 ? "profit" : "loss"}>
              {formatNumber(totalPnL)}

              <small>
                {pnlPercent >= 0 ? "+" : ""}
                {pnlPercent.toFixed(2)}%
              </small>
            </h3>

            <p>P&amp;L</p>
          </div>

          <hr />

          <div className="second">
            <p>
              Current Value
              <span>{formatNumber(currentValue)}</span>
            </p>

            <p>
              Investment
              <span>{formatNumber(totalInvestment)}</span>
            </p>
          </div>
        </div>

        <hr className="divider" />
      </div>
    </div>
  );
};

export default Summary;
