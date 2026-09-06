import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";

import AboutUs from "./components/pages/AboutUs";
import AdminDashboard from "./components/pages/AdminDashboard";
import ContactUs from "./components/pages/ContactUs";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Layout from "./layout/Layout";
import { fetchWithTokenRefresh } from "./utils/utils";
import "./App.css";
import {useState, useEffect} from "react";

function App() {
  const [currentTime, setCurrentTime] = useState("Time since Epoch!");
  const [csrfToken, setCsrfToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetchWithTokenRefresh(
        "/get-csrf-token",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrf_token);
      } else {
        console.error("Failed to fetch CSRF token");
      }
    };

    void fetchCsrfToken();

    const token = localStorage.getItem("token");

    if (token) {
      fetchWithTokenRefresh("/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isValid) {
            setIsAuthenticated(true);
            setIsAdmin(data.role === "admin");
          }
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
        });
    }
  }, []);

  const fetchTime = async () => {
    const response = await fetch("/time", {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch server time");
      return;
    }

    const data = await response.json();
    setCurrentTime(data.time);
  };

  return (
    <div className="container">
      <Layout>
        <Routes>
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route
            path="/Login"
            element={<Login csrfToken={csrfToken} />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoutes
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                element={AdminDashboard}
              />
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={fetchTime}>
          {currentTime}
        </button>
      </div>
    </div>
  );
}

export default App;