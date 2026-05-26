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

import DriverDashboard from "./pages/driver/DriverDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRestaurants from "./pages/admin/AdminRestaurants";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import AdminMasterCuisines from "./pages/admin/AdminMasterCuisines";
import AdminMasterCountries from "./pages/admin/AdminMasterCountries";
import AdminMasterTaxes from "./pages/admin/AdminMasterTaxes";
import AdminMasterCurrencies from "./pages/admin/AdminMasterCurrencies";
import AdminMasterLanguages from "./pages/admin/AdminMasterLanguages";

import AdminConfigPlatformFees from "./pages/admin/AdminConfigPlatformFees";
import AdminConfigCommissions from "./pages/admin/AdminConfigCommissions";
import AdminConfigAuditLogs from "./pages/admin/AdminConfigAuditLogs";
import AdminConfigApp from "./pages/admin/AdminConfigApp";
import AdminConfigSMTP from "./pages/admin/AdminConfigSMTP";
import AdminConfigSMS from "./pages/admin/AdminConfigSMS";
import AdminConfigPayment from "./pages/admin/AdminConfigPayment";
import AdminConfigMaintenance from "./pages/admin/AdminConfigMaintenance";
import AdminConfigNotificationTemplates from "./pages/admin/AdminConfigNotificationTemplates";
import AdminConfigHomeLayout from "./pages/admin/AdminConfigHomeLayout";

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
              allowedRoles={[
                "restaurant",
              ]}
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
              allowedRoles={[
                "restaurant",
              ]}
            >
              <RestaurantAnalytics />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/restaurant/settings"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "restaurant",
              ]}
            >
              <RestaurantSettings />
            </RoleProtectedRoute>
          }
        />

        {/* DRIVER */}

        <Route
          path="/driver/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "driver",
              ]}
            >
              <DriverDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/restaurants"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminRestaurants />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminUsers />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminOrders />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminAnalytics />
            </RoleProtectedRoute>
          }
        />

        {/* MASTER DATA */}

        <Route
          path="/admin/master/cuisines"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminMasterCuisines />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/master/countries"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminMasterCountries />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/master/taxes"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminMasterTaxes />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/master/currencies"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminMasterCurrencies />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/master/languages"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminMasterLanguages />
            </RoleProtectedRoute>
          }
        />

        {/* PLATFORM CONFIG */}

        <Route
          path="/admin/config/platform-fees"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigPlatformFees />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/commissions"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigCommissions />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/audit-logs"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigAuditLogs />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/app"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigApp />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/smtp"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigSMTP />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/sms"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigSMS />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/payment"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigPayment />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/maintenance"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigMaintenance />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/notification-templates"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigNotificationTemplates />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/config/home-layout"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminConfigHomeLayout />
            </RoleProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;