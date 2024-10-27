import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  const fetchUserBookings = useCallback(async () => {
    if (!userId) {
      setError("User ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:8080/userBookings/${userId}`,
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

      // Validate and sanitize booking data
      const sanitizedBookings = data.map((booking) => ({
        ...booking,
        status: booking.status || "unknown",
        _id: booking._id || "unknown",
        station: {
          stationName: booking.station?.stationName || "Unknown Station",
          stationAddress:
            booking.station?.stationAddress || "Address not available",
        },
        date: booking.date || new Date().toISOString(),
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
  }, [userId]);

  // Add updateBookingStatus function
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:8080/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        // Update the local state to reflect the change
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
        // Show success message
        alert(`Booking ${newStatus} successfully!`);
      } else {
        throw new Error(
          response.data.error || "Failed to update booking status"
        );
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert(err.response?.data?.error || "Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserBookings();
    }
  }, [fetchUserBookings, userId]);

  const getStatusBadgeClass = (status) => {
    const safeStatus = String(status || "").toLowerCase();

    const classes = {
      pending: "bg-warning",
      confirmed: "bg-success",
      cancelled: "bg-danger",
      completed: "bg-primary",
      unknown: "bg-secondary",
    };

    return `badge ${classes[safeStatus] || classes.unknown}`;
  };

  const filteredBookings = () => {
    switch (activeTab) {
      case "active":
        return bookings.filter((booking) =>
          ["pending", "confirmed"].includes(
            String(booking.status).toLowerCase()
          )
        );
      case "completed":
        return bookings.filter(
          (booking) => String(booking.status).toLowerCase() === "completed"
        );
      case "cancelled":
        return bookings.filter(
          (booking) => String(booking.status).toLowerCase() === "cancelled"
        );
      default:
        return bookings;
    }
  };

  const renderBookingCard = (booking) => {
    const bookingId = booking._id?.slice(-6) || "unknown";
    const stationName = booking.station?.stationName || "Unknown Station";
    const stationAddress =
      booking.station?.stationAddress || "Address not available";
    const bookingDate = booking.date ? new Date(booking.date) : new Date();

    // Add action buttons for user
    const renderActionButtons = () => {
      if (booking.status === "confirmed") {
        return (
          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => updateBookingStatus(booking._id, "cancelled")}
              disabled={loading}
            >
              <i className="bi bi-x-circle me-2"></i>
              {loading ? "Processing..." : "Cancel Booking"}
            </button>
          </div>
        );
      }
      return null;
    };

    return (
      <div key={booking._id} className="card mb-3 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Booking #{bookingId}</h5>
          <span className={getStatusBadgeClass(booking.status)}>
            {booking.status || "Unknown"}
          </span>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-geo-alt text-secondary me-2"></i>
              <span className="fw-bold">{stationName}</span>
            </div>
            <div className="ms-4 text-secondary">{stationAddress}</div>
          </div>

          <div className="d-flex gap-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar text-secondary me-2"></i>
              <span>{bookingDate.toLocaleDateString()}</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-clock text-secondary me-2"></i>
              <span>{bookingDate.toLocaleTimeString()}</span>
            </div>
          </div>

          {renderActionButtons()}
        </div>
      </div>
    );
  };

  // Rest of the component remains the same...
  if (!userId) {
    return (
      <div className="container">
        <Navbar />
        <div className="alert alert-warning m-3" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-circle me-2"></i>
            <div>
              <h5 className="alert-heading mb-1">Not Logged In</h5>
              <p className="mb-0">
                Please log in to view your booking history.
              </p>
            </div>
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
          onClick={fetchUserBookings}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      <div className="container py-4">
        <h2 className="mb-4">Your Booking History</h2>

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
              className={`nav-link ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active
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

export default UserBookingHistory;
