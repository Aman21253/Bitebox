import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/customer/Home";
import RestaurantDetails from "./pages/customer/RestaurantDetails";
import ProtectedRoute from "./routes/ProtectedRoute";

import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Checkout from "./pages/customer/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";

import MyOrders from "./pages/customer/MyOrders";
import TrackOrder from "./pages/customer/TrackOrder";

import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantMenu from "./pages/restaurant/RestaurantMenu";
import RestaurantOrders from "./pages/restaurant/RestaurantOrders";
import RestaurantAnalytics from "./pages/restaurant/RestaurantAnalytics";
import RestaurantSettings from "./pages/restaurant/RestaurantSettings";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* CUSTOMER */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success/:orderId"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order/:id"
          element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          }
        />

        {/* RESTAURANT */}

        <Route
          path="/restaurant/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "restaurant",
              ]}
            >
              <RestaurantDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/restaurant/menu"
          element={
            <RoleProtectedRoute
              allowedRoles={["restaurant"]}
            >
              <RestaurantMenu />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant/orders"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "restaurant",
              ]}
            >
              <RestaurantOrders />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/restaurant/analytics"
          element={
            <RoleProtectedRoute
              allowedRoles={["restaurant"]}
            >
              <RestaurantAnalytics />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant/settings"
          element={
            <RoleProtectedRoute
              allowedRoles={["restaurant"]}
            >
              <RestaurantSettings />
            </RoleProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;