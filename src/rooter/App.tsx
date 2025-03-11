import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/dashboard/Profile";
import DashboardHome from "../pages/dashboard/DashboardHome";
import User from "../pages/dashboard/Users";
import { Hotel } from "../pages/Hotel";
import { DashboardHotel } from "../pages/dashboard/DashboardHotel";
import { AuthService } from "../services/Auth.service";
import { HotelDetails } from "../pages/HotelDetails";
import { DashboardHotelDetails } from "../pages/dashboard/DashboardHotelDetails";
import Booking from "../pages/dashboard/Bookings";
import Footer from "../components/Footer";
import Header from "../components/Header";

const App = () => {
  const PrivateRoute = () => {
    return !AuthService.isTokenExpired() ? <Outlet /> : <Navigate to="/signin" />;
  };
  
  const PublicLayout = () => {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  };
  
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="hotel" element={<DashboardHotel />} />
            <Route path="hotel/:id" element={<DashboardHotelDetails />} />
            <Route path="user" element={<User />} />
            <Route path="profile" element={<Profile />} />
            <Route path="booking" element={<Booking />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;