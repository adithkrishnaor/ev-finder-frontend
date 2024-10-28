import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const StationList = () => {
  const [stations, setStations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }
    // Fetch all stations from the backend API
    const fetchStations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/getAllStations"
        );
        setStations(response.data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };
    fetchStations();
  }, []);

  const handleBookNow = (stationId) => {
    // Navigate to the booking page with the station ID
    navigate(`/booking?stationId=${stationId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <center>
          <h1>Available Stations</h1>
        </center>
        <br />
        <div className="row">
          {stations.map((station) => (
            <div className="col-md-4 mb-4" key={station._id}>
              <div className="card">
                <div className="card-body">
                  <center>
                    <h5 className="card-title">{station.stationName}</h5>
                  </center>
                  <hr />
                  <p className="card-text">Place : {station.stationAddress}</p>
                  <p className="card-text">Type: {station.stationType}</p>
                  <p className="card-text">
                    Charging Points: {station.chargingPoints}
                  </p>
                  <hr />
                  <center>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleBookNow(station._id)}
                    >
                      Book Now
                    </button>
                  </center>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationList;
