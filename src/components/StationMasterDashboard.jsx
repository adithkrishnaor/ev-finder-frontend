import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "./StationNavbar";
import { useNavigate } from "react-router-dom";

const StationMasterDashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get stationMasterId from localStorage
  const stationMasterId = localStorage.getItem("stationMasterId");

  useEffect(() => {
    if (!stationMasterId) {
      navigate("/");
      return;
    }
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const stationMasterId = localStorage.getItem("stationMasterId");

      if (!stationMasterId) {
        setError("Not authorized. Please login.");
        // Note: In a real app, you'd use navigation here
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/stationMasterStations/${stationMasterId}`
      );

      setStations(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch stations: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (stationId) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      // Add delete functionality here
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row mb-4">
          <div className="col">
            <h2 className="mb-4">My Charging Stations</h2>
            <button
              className="btn btn-success mb-4"
              onClick={() => navigate("/addStation")}
            >
              Add New Station
            </button>
          </div>
        </div>

        {stations.length === 0 ? (
          <div className="alert alert-info" role="alert">
            You haven't added any stations yet.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {stations.map((station) => (
              <div className="col" key={station._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{station.stationName}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {station.stationType}
                    </h6>
                    <p className="card-text">
                      <strong>Address:</strong> {station.stationAddress}
                      <br />
                      <strong>Charging Points:</strong> {station.chargingPoints}
                      <br />
                      <strong>Location:</strong>{" "}
                      {station.location.coordinates[1].toFixed(6)},{" "}
                      {station.location.coordinates[0].toFixed(6)}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(station._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {stations.length > 0 && (
          <div className="row mt-5">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Stations Map View</h5>
                </div>
                <div className="card-body">
                  <MapContainer
                    center={[9.931, 76.256]}
                    zoom={6}
                    style={{ height: "200px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {stations.map((station) => (
                      <Marker
                        key={station.id} // Ensure each marker has a unique key
                        position={[
                          station.location.coordinates[1],
                          station.location.coordinates[0],
                        ]}
                      >
                        <Popup>{station.stationName}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationMasterDashboard;
