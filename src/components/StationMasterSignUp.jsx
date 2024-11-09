import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const StationMasterSignUp = () => {
  const [data, setData] = new useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "", // Added confirm password
    phoneNumber: "",
    address: "",
    companyName: "",
  });

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/; // Example: Validates a 10-digit phone number
    return re.test(phone);
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/;
    return re.test(password);
  };

  const readValue = () => {
    if (
      !data.fullName ||
      !data.email ||
      !data.password ||
      !data.confirmPassword || // Added check for confirm password
      !data.phoneNumber ||
      !data.address ||
      !data.companyName
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!validatePhoneNumber(data.phoneNumber)) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!validateEmail(data.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(data.password)) {
      alert(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
      );
      return;
    }

    console.log(data);

    let newdata = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      address: data.address,
      companyName: data.companyName,
    };

    axios
      .post("http://localhost:8080/stationSignUp", newdata)
      .then((response) => {
        if (response.data && response.data.status === "success") {
          alert("Successfully Signed Up");
          setData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "", // Added confirm password
            phoneNumber: "",
            address: "",
            companyName: "",
          });
        } else if (response.data.status === "email already exist") {
          alert("Email Already Exists");
          setData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "", // Added confirm password
            phoneNumber: "",
            address: "",
            companyName: "",
          });
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      })
      .catch((error) => {
        console.error("There was an error signing up!", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="row g-2">
      <div className="col col-12">
        <label htmlFor="" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          className="form-control"
          name="fullName"
          value={data.fullName}
          onChange={inputHandler}
          maxLength={25}
          required
        />
      </div>
      <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <label htmlFor="" className="form-label">
          Address
        </label>
        <input
          type="text"
          className="form-control"
          name="address"
          value={data.address}
          onChange={inputHandler}
          maxLength={30}
          required
        />
      </div>
      <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <label htmlFor="" className="form-label">
          Company Name
        </label>
        <input
          type="text"
          className="form-control"
          name="companyName"
          value={data.companyName}
          onChange={inputHandler}
          maxLength={30}
          required
        />
      </div>
      <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
        <label htmlFor="" className="form-label">
          Phone Number
        </label>
        <input
          type="number"
          className="form-control"
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={inputHandler}
          required
        />
      </div>
      <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
        <label htmlFor="" className="form-label">
          Email
        </label>
        <input
          type="text"
          className="form-control"
          name="email"
          value={data.email}
          onChange={inputHandler}
          maxLength={30}
          required
        />
      </div>
      <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
        <label htmlFor="" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={data.password}
          onChange={inputHandler}
          maxLength={25}
          required
        />
      </div>

      <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
        <label htmlFor="" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          className="form-control"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={inputHandler}
          maxLength={25}
          required
        />
      </div>

      <div className="col-12 text-center mt-3">
        <button className="btn btn-primary px-4" onClick={readValue}>
          Signup
        </button>
        <div className="mt-2">
          <Link to="/login">Existing user? Login Here</Link>
        </div>
      </div>
    </div>
  );
};

export default StationMasterSignUp;
