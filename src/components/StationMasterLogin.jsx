import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const StationMasterLogin = () => {
  const [data, setData] = new useState({
    email: "",
    password: "",
  });

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const navigate = useNavigate();

  const readValue = () => {
    axios
      .post("http://localhost:8080/stationLogin", data)
      .then((response) => {
        console.log(response.data);
        if (response.data.status == "Invalid Email") {
          alert("Invalid Email");
        } else if (response.data.status == "Invalid Password") {
          alert("Invalid Password");
        } else {
          let token = response.data.token;
          let userId = response.data.userId;

          console.log(token);
          console.log(userId);

          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);

          navigate("/addStation");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12  d-flex justify-content-center">
            <div className="card w-50 border-rounded border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">
                  Station Master Login
                </h2>
                <div className="row g-3">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={data.email}
                      onChange={inputHandler}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={inputHandler}
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <center>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={readValue}
                      >
                        Login
                      </button>
                    </center>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <center>
                      <Link to="/stationSignUp">
                        Don't have an account? Sign Up
                      </Link>
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

export default StationMasterLogin;
