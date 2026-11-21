import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./hero-brand-dock.css";
import "./navbar-relief.css";

ReactDOM.createRoot(document.getElementById("root")).render(
        <Router>
            <App />
        </Router>
);
