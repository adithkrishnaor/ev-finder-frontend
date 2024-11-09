import React, { useState } from "react";
import SignUp from "./SignUp";
import StationMasterSignUp from "./StationMasterSignUp";

const CombinedSignup = () => {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "rgba(255, 255, 255, 0.95)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="card-body p-4 p-md-5">
          <h2
            className="card-title text-center mb-4"
            style={{
              color: "#2c3e50",
              fontSize: "2rem", // Changed from 2.5rem to 2rem
              fontWeight: "500", // Changed from 600 to 500
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Create New Account
          </h2>

          <div className="form-group mb-4">
            <label
              htmlFor="roleSelect"
              className="form-label fw-bold"
              style={{ color: "#34495e" }}
            >
              Select Role
            </label>
            <select
              className="form-select form-select-lg"
              id="roleSelect"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                borderColor: "#cbd5e0",
              }}
              onMouseOver={(e) => (e.target.style.borderColor = "#3498db")}
              onMouseOut={(e) => (e.target.style.borderColor = "#cbd5e0")}
            >
              <option value="">Choose your role</option>
              <option value="user">EV User</option>
              <option value="station">Station Owner</option>
            </select>
          </div>

          <div
            style={{
              opacity: selectedRole ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {selectedRole === "user" && <SignUp />}
            {selectedRole === "station" && <StationMasterSignUp />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedSignup;
