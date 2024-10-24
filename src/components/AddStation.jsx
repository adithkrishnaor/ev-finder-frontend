import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import Navbar from "./StationNavbar";

const AddStation = () => {
  const [data, setData] = useState({
    stationName: "",
    stationAddress: "",
    stationType: "",
    chargingPoints: 0,
    location: null,
  });

  const [stations, setStations] = useState([]);

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    if (!data.stationName) {
      alert("Station Name is required.");
      return false;
    }
    if (!data.stationAddress) {
      alert("Station Address is required.");
      return false;
    }
    if (!data.stationType) {
      alert("Station Type is required.");
      return false;
    }
    if (!data.chargingPoints) {
      alert("Charging Points are required.");
      return false;
    }
    if (!data.location) {
      alert("Please select a location on the map.");
      return false;
    }
    return true;
  };

  const stationSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/addStation", {
        ...data,
        location: {
          type: "Point",
          coordinates: [data.location.lng, data.location.lat],
        },
      });
      if (response.data.status === "success") {
        alert("Station added successfully.");
        fetchStations(); // Refresh the stations list
      } else if (response.data.status === "Station already exists") {
        alert("A station already exists at this location.");
      } else {
        alert("Failed to add station.");
      }
    } catch (error) {
      console.log("error", error);
      alert("Failed to add station.");
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        setData((prev) => ({ ...prev, location: e.latlng }));
      },
    });
    return null;
  };

  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:8080/getAllStations");
      const stationsData = await response.json();
      setStations(stationsData);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <Navbar />
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-rounded border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Add Station</h2>
                <form onSubmit={stationSubmit}>
                  <div className="mb-3">
                    <label htmlFor="stationName" className="form-label">
                      Station Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="stationName"
                      name="stationName"
                      value={data.stationName}
                      onChange={inputHandler}
                      required
                      maxLength={25}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="stationAddress" className="form-label">
                      Station Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="stationAddress"
                      name="stationAddress"
                      value={data.stationAddress}
                      onChange={inputHandler}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="stationType" className="form-label">
                      Station Type
                    </label>
                    <select
                      className="form-select"
                      id="stationType"
                      name="stationType"
                      value={data.stationType}
                      onChange={inputHandler}
                      required
                    >
                      <option value="">Select Station Type</option>
                      <option value="Fast Charging">Fast Charging</option>
                      <option value="Slow Charging">Slow Charging</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="chargingPoints" className="form-label">
                      Charging Points
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="chargingPoints"
                      name="chargingPoints"
                      value={data.chargingPoints}
                      onChange={inputHandler}
                      required
                      min={1}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <div style={{ height: "400px" }}>
                      <MapContainer
                        center={[9.931, 76.256]}
                        zoom={7}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapEvents />
                        {data.location && (
                          <Marker position={data.location}>
                            <Popup>Selected Location</Popup>
                          </Marker>
                        )}
                        {stations.map((station) => (
                          <Marker
                            key={station._id}
                            position={[
                              station.location.coordinates[1],
                              station.location.coordinates[0],
                            ]}
                          >
                            <Popup>
                              {station.stationName}
                              <br />
                              {station.stationAddress}
                              <br />
                              {station.stationType}
                              <br />
                              Charging Points: {station.chargingPoints}
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      Add Station
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStation;
