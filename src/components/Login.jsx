import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const readValue = () => {
    console.log("Login attempt:", data);

    axios
      .post("http://localhost:8080/login", data)
      .then((response) => {
        console.log("Server response:", response.data);

        if (response.data.status === "success") {
          const { token, userId, userType } = response.data;

          localStorage.setItem("token", token);

          if (userType === "stationMaster") {
            localStorage.setItem("stationMasterId", userId);
            navigate("/stationMasterDashboard");
          } else {
            localStorage.setItem("userId", userId);
            navigate("/map");
          }

          localStorage.setItem("userType", userType);
        } else {
          alert(response.data.status || "Login failed");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed");
      });
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 d-flex justify-content-center">
            <div className="card w-50 border-rounded border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Login</h2>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={data.email}
                      onChange={inputHandler}
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={data.password}
                      onChange={inputHandler}
                    />
                  </div>
                  <div className="col-12">
                    <center>
                      <button
                        className="btn btn-primary w-50"
                        onClick={readValue}
                      >
                        Login
                      </button>
                    </center>
                  </div>
                  <div className="col-12">
                    <center>
                      <Link to="/">Don't have an account? Sign Up</Link>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
