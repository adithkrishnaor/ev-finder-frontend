import React from 'react';
import './HomePage.css'; // Import the CSS file for styling

const HomePage = () => {
    return (
      <div>
        <div className="homepage-container">
          {/* Left Side for Users */}
          <div className="left-side">
            <h2>User</h2>
            <a href="/signin">Login</a>
            <a href="/signup">Sign Up</a>
          </div>

          {/* Right Side for Station Masters */}
          <div className="right-side">
            <h2>Station Master</h2>
            <a href="/stationmaster-login">Login</a>
            <a href="/stationSignUp">Sign Up</a>
          </div>
        </div>
      </div>
    );
};

export default HomePage;
