import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import MapScreen from "./components/MapScreen";
import StationMasterSignUp from "./components/StationMasterSignUp";
import StationMasterLogin from "./components/StationMasterLogin";
import AddStation from "./components/AddStation";
import BookingForm from "./components/Booking";
import UserBookingHistory from "./components/UserBookingHistory";
import StationBookingHistory from "./components/StationBookingHistory";
import StationMasterDashboard from "./components/StationMasterDashboard";
import StationList from "./components/StationList";
import CommunityPage from "./components/CommunityPage";
import CommunityPageStation from "./components/CommunityPageStation";
import CombinedSignup from "./components/CombinedSignup";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CombinedSignup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}
        <Route path="/map" element={<MapScreen />} />
        {/* <Route path="/stationSignUp" element={<StationMasterSignUp />} /> */}
        {/* <Route path="/stationLogin" element={<StationMasterLogin />} /> */}
        <Route path="/addStation" element={<AddStation />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/userBookingHistory" element={<UserBookingHistory />} />
        <Route
          path="/stationBookingHistory"
          element={<StationBookingHistory />}
        />
        <Route
          path="/stationMasterDashboard"
          element={<StationMasterDashboard />}
        />
        <Route path="/stationList" element={<StationList />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/communityStation" element={<CommunityPageStation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
