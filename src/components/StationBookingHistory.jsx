import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./StationNavbar";

const StationBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const stationId = localStorage.getItem("stationId");

  const fetchStationBookings = useCallback(async () => {
    if (!stationId) {
      setError("Station ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:8080/stationBookings/${stationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      const sanitizedBookings = data.map((booking) => ({
        _id: booking._id || "unknown",
        bookingStatus: booking.bookingStatus || "unknown",
        bookingDate: booking.bookingDate || new Date().toISOString(),
        timeSlot: booking.timeSlot || "N/A",
        vehicleNumber: booking.vehicleNumber || "N/A",
        user: {
          name: booking.user?.name || "Unknown User",
          email: booking.user?.email || "N/A",
          phone: booking.user?.phone || "N/A",
        },
      }));

      setBookings(sanitizedBookings);
    } catch (err) {
      console.error("Booking fetch error:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    if (stationId) {
      fetchStationBookings();
    }
  }, [fetchStationBookings, stationId]);

  const getStatusBadgeClass = (status) => {
    const safeStatus = String(status || "").toLowerCase();

    const classes = {
      confirmed: "bg-primary",
      completed: "bg-success",
      cancelled: "bg-danger",
      unknown: "bg-secondary",
    };

    return `badge ${classes[safeStatus] || classes.unknown}`;
  };

  const filteredBookings = () => {
    switch (activeTab) {
      case "confirmed":
        return bookings.filter(
          (booking) =>
            String(booking.bookingStatus).toLowerCase() === "confirmed"
        );
      case "completed":
        return bookings.filter(
          (booking) =>
            String(booking.bookingStatus).toLowerCase() === "completed"
        );
      case "cancelled":
        return bookings.filter(
          (booking) =>
            String(booking.bookingStatus).toLowerCase() === "cancelled"
        );
      default:
        return bookings;
    }
  };

  if (!stationId) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-circle me-2"></i>
          <div>
            <h5 className="alert-heading mb-1">Station ID Required</h5>
            <p className="mb-0">
              Please provide a station ID to view booking history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <h5 className="alert-heading mb-1">Error Loading Bookings</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
        <button
          className="btn btn-outline-danger btn-sm mt-2"
          onClick={fetchStationBookings}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Retry
        </button>
      </div>
    );
  }

  const renderBookingCard = (booking) => {
    const bookingId = booking._id?.slice(-6) || "unknown";
    const bookingDate = booking.bookingDate
      ? new Date(booking.bookingDate)
      : new Date();

    return (
      <div key={booking._id} className="card mb-3 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Booking #{bookingId}</h5>
          <span className={getStatusBadgeClass(booking.bookingStatus)}>
            {booking.bookingStatus}
          </span>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h6 className="mb-2">Customer Details</h6>
            <div className="ms-3">
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-person text-secondary me-2"></i>
                <span>{booking.user.name}</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-envelope text-secondary me-2"></i>
                <span>{booking.user.email}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-telephone text-secondary me-2"></i>
                <span>{booking.user.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h6 className="mb-2">Booking Details</h6>
            <div className="ms-3">
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-calendar text-secondary me-2"></i>
                <span>{bookingDate.toLocaleDateString()}</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <i className="bi bi-clock text-secondary me-2"></i>
                <span>{booking.timeSlot}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-car-front text-secondary me-2"></i>
                <span>{booking.vehicleNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <Navbar />
      <h2 className="mb-4">Station Booking History</h2>

      <ul className="nav nav-tabs mb-4">
        {["all", "confirmed", "completed", "cancelled"].map((tab) => (
          <li key={tab} className="nav-item">
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {filteredBookings().length === 0 ? (
          <div className="text-center text-secondary py-5">
            <i className="bi bi-inbox h1 d-block mb-3"></i>
            <p>No bookings found</p>
          </div>
        ) : (
          filteredBookings().map(renderBookingCard)
        )}
      </div>
    </div>
  );
};

export default StationBookingHistory;
