import React, { useState, useEffect, useCallback } from "react";

const UserBookingHistory = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchUserBookings = useCallback(async () => {
    if (!userId) {
      setError("User ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/userBookings/${userId}`);

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || errorData.details || "Failed to fetch bookings"
          );
        } else {
          throw new Error(
            `Server error: ${response.statusText || response.status}`
          );
        }
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      setBookings(data);
    } catch (err) {
      console.error("Booking fetch error:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Only fetch if userId is provided
    if (userId) {
      fetchUserBookings();
    }
  }, [fetchUserBookings, userId]);

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "bg-warning",
      confirmed: "bg-success",
      cancelled: "bg-danger",
      completed: "bg-primary",
    };
    return `badge ${classes[status.toLowerCase()] || "bg-secondary"}`;
  };

  const filteredBookings = () => {
    switch (activeTab) {
      case "active":
        return bookings.filter((booking) =>
          ["pending", "confirmed"].includes(booking.status.toLowerCase())
        );
      case "completed":
        return bookings.filter(
          (booking) => booking.status.toLowerCase() === "completed"
        );
      case "cancelled":
        return bookings.filter(
          (booking) => booking.status.toLowerCase() === "cancelled"
        );
      default:
        return bookings;
    }
  };

  // Show appropriate UI when userId is not provided
  if (!userId) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-circle me-2"></i>
          <div>
            <h5 className="alert-heading mb-1">User ID Required</h5>
            <p className="mb-0">
              Please provide a valid user ID to view booking history.
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

  const renderBookingCard = (booking) => (
    <div key={booking._id} className="card mb-3 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Booking #{booking._id.slice(-6)}</h5>
        <span className={getStatusBadgeClass(booking.status)}>
          {booking.status}
        </span>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt text-secondary me-2"></i>
            <span className="fw-bold">{booking.station.stationName}</span>
          </div>
          <div className="ms-4 text-secondary">
            {booking.station.stationAddress}
          </div>
        </div>

        <div className="d-flex gap-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-calendar text-secondary me-2"></i>
            <span>{new Date(booking.date).toLocaleDateString()}</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="bi bi-clock text-secondary me-2"></i>
            <span>{new Date(booking.date).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
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
            className={`nav-link ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "cancelled" ? "active" : ""}`}
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
  );
};

export default UserBookingHistory;
