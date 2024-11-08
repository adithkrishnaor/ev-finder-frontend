import React, { useState } from "react";
import SignUp from "./SignUp";
import StationMasterSignUp from "./StationMasterSignUp";

const CombinedSignup = () => {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-rounded border-secondary shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Sign Up</h2>

              <div className="mb-4">
                <label htmlFor="roleSelect" className="form-label">
                  Select Role
                </label>
                <select
                  className="form-select"
                  id="roleSelect"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Choose your role</option>
                  <option value="user">EV User</option>
                  <option value="station">Station Owner</option>
                </select>
              </div>

              {selectedRole === "user" && <SignUp />}
              {selectedRole === "station" && <StationMasterSignUp />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedSignup;
