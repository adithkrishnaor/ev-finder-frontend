import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Navbar from './Navbar';

// Fix for default marker icon (same as before)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Create a custom icon for the user's location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
    });
  }, [map]);

  const handleMoveToLocation = () => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  };

  return (
    <>
      <div
        className="leaflet-bar leaflet-control leaflet-control-custom"
        style={{
          backgroundColor: 'white',
          backgroundImage: 'url(https://cdn-icons-png.flaticon.com/512/684/684908.png)',
          backgroundSize: '30px 30px',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000
        }}
        onClick={handleMoveToLocation}
      ></div>
      {position === null ? null : (
        <Marker position={position} icon={userIcon}>
          <Popup>
            You are here.
          </Popup>
        </Marker>
      )}
    </>
  );
}

const MapScreen = () => {
  const stations = [
    { id: 1, lat: 51.505, lon: -0.09, name: "Station 1", type: "Fast Charging" },
    { id: 2, lat: 51.51, lon: -0.1, name: "Station 2", type: "Slow Charging" },
    // Add more stations as needed
  ];

  return (
    
    <div style={{ height: '94vh', width: '100vw' }}>
    <Navbar/>
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stations.map((station) => (
          <Marker key={station.id} position={[station.lat, station.lon]}>
            <Popup>
              <b>{station.name}</b><br />
              Type: {station.type}
            </Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapScreen;