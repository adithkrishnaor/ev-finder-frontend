import axios from "axios";
import React, { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

const AddStation = () => {
  const [data, setData] = new useState({
    stationName: "",
    stationAddress: "",
    stationType: "",
    chargingPoints: 0,
    location: null,
  });

  const inputHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const stationSubmit = async (e) => {
    e.preventDefault();
    if (!data.location) {
      alert("Please select a location on the map.");
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
      if (response.data.status == "success") {
        alert("Station added successfully.");
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

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12  d-flex justify-content-center">
            <div className="card w-50 border-rounded border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Add Station</h2>
                <div className="row g-3">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
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
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
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
                    />
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <div style={{ height: "400px" }}>
                      <MapContainer
                        center={[51.505, -0.09]}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapEvents />
                        {data.location === null ? null : (
                          <Marker position={data.location}>
                            <Popup>Station Location</Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </div>
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <center>
                      <button
                        className="btn btn-success w-50"
                        onClick={stationSubmit}
                      >
                        Add Station
                      </button>
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

export default AddStation;
