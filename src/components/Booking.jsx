import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const BookingForm = () => {
  const location = useLocation();
  const { station } = location.state;
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    vehicleNumber: "",
  });
  const [error, setError] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBookingChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const validateVehicleNumber = (vehicleNumber) => {
    const vehicleNumberPattern = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    return vehicleNumberPattern.test(vehicleNumber);
  };

  const validateForm = () => {
    const { date, time, vehicleNumber } = bookingDetails;
    if (!date || !time || !vehicleNumber) {
      setError("All fields are required.");
      return false;
    }
    if (!validateVehicleNumber(vehicleNumber)) {
      setError("Invalid vehicle number format.");
      return false;
    }
    setError("");
    return true;
  };

  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPaymentForm(true);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setShowPaymentForm(false);
  };

  const timeOptions = [
    "00:00 - 01:00",
    "01:00 - 02:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00",
    "05:00 - 06:00",
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00",
    "23:00 - 00:00",
  ];

  return (
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
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          position: "relative",
        }}
      >
        {!bookingConfirmed ? (
          <>
            <h5>Book Slot at {station.stationName}</h5>
            <form onSubmit={handleBookingSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="bookingDate">Booking Date:</label>
                <input
                  type="date"
                  id="bookingDate"
                  name="date"
                  value={bookingDetails.date}
                  onChange={handleBookingChange}
                  min={getTomorrowDate()}
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
                <label htmlFor="bookingTime">Time Slot:</label>
                <select
                  id="bookingTime"
                  name="time"
                  value={bookingDetails.time}
                  onChange={handleBookingChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="vehicleNumber">Vehicle Number:</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={bookingDetails.vehicleNumber}
                  onChange={handleBookingChange}
                  placeholder="KL07AA1234"
                  maxLength={10}
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
              {error && <p style={{ color: "red" }}>{error}</p>}
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
                Book Now
              </button>
            </form>
          </>
        ) : (
          <div>
            <center>
              <h5>Booking Confirmed</h5>
            </center>
            <hr />
            <p>Station: {station.stationName}</p>
            <p>Date: {bookingDetails.date}</p>
            <p>Time: {bookingDetails.time}</p>
            <p>Vehicle Number: {bookingDetails.vehicleNumber}</p>
            <center>
              <button
                style={{
                  width: "80%",
                  padding: "6px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                <Link
                  to="/map"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Home
                </Link>
              </button>
            </center>
          </div>
        )}
      </div>
      {showPaymentForm && (
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
            zIndex: 3000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              position: "relative",
            }}
          >
            <h5>Payment Details</h5>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ marginBottom: "10px" }}>
                <label htmlFor="cardUserName">Full Name:</label>
                <input
                  type="text"
                  id="cardUserName"
                  name="cardUserName"
                  placeholder="Card Owner Name"
                  maxLength={20}
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
                <label htmlFor="cardNumber">Card Number:</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
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
                <label htmlFor="expiryDate">Expiry Date:</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  maxLength={5}
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
                <label htmlFor="cvv">CVV:</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  maxLength={3}
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
                Pay Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
