import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Holdings from "./Holdings";
import Orders from "./Orders";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";

import api from "../api"; // Change path if your api.js is elsewhere

const Dashboard = () => {
  console.dir("Dashboard rendered");
  useEffect(() => {
    const verifyUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);

        // Remove token from URL
        window.history.replaceState({}, "", "/");
      }

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "https://investx-land1.onrender.com/login";
        return;
      }

      try {
        await api.get("/verify");
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "https://investx-land1.onrender.com/login";
      }
    };

    verifyUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    window.location.href=import.meta.env.VITE_LANDING_URL;
  };

  return (
    <GeneralContextProvider>
      <div className="dashboard-container">
        <WatchList />

        <div className="content">
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
          </Routes>
        </div>

        {/* Uncomment when you add a navbar */}
        <button onClick={logout}>Logout</button>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
