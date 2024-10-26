import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./StationNavbar";

const StationBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Get stationMasterId from localStorage
  const stationMasterId = localStorage.getItem("stationMasterId");

  const fetchStationBookings = useCallback(async () => {
    if (!stationMasterId) {
      setError("stationMasterId is required");
      console.log("stationMasterId is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch the list of stations managed by the station master
      const stationsResponse = await axios.get(
        `http://localhost:8080/stationMasterStations/${stationMasterId}`
      );
      const stationIds = stationsResponse.data.map((station) => station._id);

      // Fetch the booking details for each station
      const bookingPromises = stationIds.map((stationId) =>
        axios.get(`http://localhost:8080/stationBookings/${stationId}`)
      );

      const bookingResponses = await Promise.all(bookingPromises);

      const allBookings = bookingResponses.flatMap((response) => response.data);

      // Validate and sanitize booking data
      const sanitizedBookings = allBookings.map((booking) => ({
        ...booking,
        bookingStatus: booking.bookingStatus || "unknown",
        _id: booking._id || "unknown",
        user: {
          name: booking.user?.name || "Unknown User",
          email: booking.user?.email || "Email not available",
          phone: booking.user?.phone || "Phone not available",
        },
        bookingDate: booking.bookingDate || new Date().toISOString(),
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
  }, [stationMasterId]);

  useEffect(() => {
    if (stationMasterId) {
      fetchStationBookings();
    }
  }, [fetchStationBookings, stationMasterId]);

  const getStatusBadgeClass = (status) => {
    const safeStatus = String(status || "").toLowerCase();

    const classes = {
      confirmed: "bg-warning",
      completed: "bg-success",
      cancelled: "bg-danger",
      unknown: "bg-secondary",
    };

    return `badge ${classes[safeStatus] || classes.unknown}`;
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchStationBookings(); // Refresh bookings after update
      alert(`Booking ${newStatus} successfully!`);
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update booking status");
    }
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

  if (!stationMasterId) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-circle me-2"></i>
          <div>
            <h5 className="alert-heading mb-1">Not Logged In</h5>
            <p className="mb-0">Please log in to view station bookings.</p>
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
            <p className="mb-2">{error}</p>
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
    const userName = booking.user?.name || "Unknown User";
    const userEmail = booking.user?.email || "Email not available";
    const userPhone = booking.user?.phone || "Phone not available";
    const bookingDate = booking.bookingDate
      ? new Date(booking.bookingDate)
      : new Date();

    return (
      <div key={booking._id} className="card mb-3 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Booking #{bookingId}</h5>
          <span className={getStatusBadgeClass(booking.bookingStatus)}>
            {booking.bookingStatus || "Unknown"}
          </span>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-person text-secondary me-2"></i>
              <span className="fw-bold">{userName}</span>
            </div>
            <div className="ms-4 text-secondary">
              <div>{userEmail}</div>
              <div>{userPhone}</div>
            </div>
          </div>

          <div className="d-flex gap-4 mb-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar text-secondary me-2"></i>
              <span>{bookingDate.toLocaleDateString()}</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-clock text-secondary me-2"></i>
              <span>{booking.timeSlot}</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-car-front text-secondary me-2"></i>
              <span>{booking.vehicleNumber}</span>
            </div>
          </div>

          {booking.bookingStatus === "confirmed" && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => updateBookingStatus(booking._id, "completed")}
              >
                <i className="bi bi-check-circle me-2"></i>
                Complete
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => updateBookingStatus(booking._id, "cancelled")}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Station Booking History</h2>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Bookings
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "confirmed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("confirmed")}
            >
              Confirmed
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "completed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "cancelled" ? "active" : ""
              }`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {filteredBookings().length === 0 ? (
            <p className="text-center text-secondary py-5">No bookings found</p>
          ) : (
            filteredBookings().map(renderBookingCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default StationBookingHistory;
