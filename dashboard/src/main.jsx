import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import TopBar from "./components/TopBar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar></TopBar>
      <Dashboard></Dashboard>
    </BrowserRouter>
  </React.StrictMode>
);
