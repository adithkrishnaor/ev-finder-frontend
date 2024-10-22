import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "./Navbar";
import axios from "axios";

// Default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Create a custom icon for the user's location
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Create a custom icon for the stations
const stationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({ setUserLocation }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
      setUserLocation(e.latlng);
    });
  }, [map, setUserLocation]);

  const handleMoveToLocation = () => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      setUserLocation(e.latlng);
    });
  };

  return (
    <>
      <button
        onClick={handleMoveToLocation}
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        Locate Me
      </button>
      {position === null ? null : (
        <Marker position={position} icon={userIcon}>
          <Popup>You are here.</Popup>
        </Marker>
      )}
    </>
  );
}

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const nearestStationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapScreen = () => {
  const [stations, setStations] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    vehicleNumber: "",
  });
  const mapRef = useRef(null);

  useEffect(() => {
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

  const findNearestStation = () => {
    if (!userLocation || stations.length === 0) return;

    let nearest = null;
    let minDistance = Infinity;

    stations.forEach((station) => {
      const stationCoords = {
        lat: station.location.coordinates[1],
        lng: station.location.coordinates[0],
      };
      const distance = haversineDistance(userLocation, stationCoords);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = station;
      }
    });

    setNearestStation(nearest);
    if (nearest && mapRef.current) {
      mapRef.current.flyTo(
        [nearest.location.coordinates[1], nearest.location.coordinates[0]],
        14
      );
    }
  };

  const handleBookNow = (station) => {
    alert(`Booking station: ${station.stationName}`);
    // Add your booking logic here
  };

  const handleBookingChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert("Booking Successful");
    setShowBookingForm(false);
  };

  return (
    <div style={{ height: "90vh", width: "100vw" }}>
      <Navbar />
      <MapContainer
        center={[9.931, 76.256]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker setUserLocation={setUserLocation} />
        <button
          onClick={findNearestStation}
          style={{
            position: "absolute",
            top: "50px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          Find Nearest Station
        </button>
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[
              station.location.coordinates[1],
              station.location.coordinates[0],
            ]}
            icon={stationIcon}
          >
            <Popup>
              <center>
                <strong>{station.stationName}</strong>
              </center>
              <br />
              Type: {station.stationType}
              <br />
              Address: {station.stationAddress}
              <br />
              Charging Points: {station.chargingPoints}
              <br /> <br />
              <center>
                <button
                  onClick={() => handleBookNow(station)}
                  style={{
                    backgroundColor: "#4CAF50", // Green background
                    border: "none", // Remove border
                    color: "white", // White text
                    padding: "5px 10px", // Some padding
                    textAlign: "center", // Centered text
                    textDecoration: "none", // Remove underline
                    display: "inline-block", // Make the button inline-block
                    fontSize: "14px", // Increase font size
                    margin: "4px 2px", // Some margin
                    cursor: "pointer", // Pointer cursor on hover
                    borderRadius: "12px", // Rounded corners
                  }}
                >
                  Book Now
                </button>
              </center>
            </Popup>
          </Marker>
        ))}
        {nearestStation && (
          <Marker
            position={[
              nearestStation.location.coordinates[1],
              nearestStation.location.coordinates[0],
            ]}
            icon={nearestStationIcon}
          >
            <Popup>
              <strong>Nearest Station: {nearestStation.stationName}</strong>
              <br />
              Type: {nearestStation.stationType}
              <br />
              <button
                style={{
                  cursor: "pointer",
                  borderRadius: "12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  marginTop: "10px",
                }}
                onClick={() => setShowBookingForm(true)}
              >
                Book Now
              </button>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Booking Form */}
      {showBookingForm && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h5>Book Slot</h5>
            <form onSubmit={handleBookingSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingDetails.date}
                  onChange={handleBookingChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Time Slot</label>
                <input
                  type="time"
                  name="time"
                  value={bookingDetails.time}
                  onChange={handleBookingChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={bookingDetails.vehicleNumber}
                  onChange={handleBookingChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
