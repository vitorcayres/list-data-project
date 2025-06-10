import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthProvider";
import { ThemeProvider } from "../contexts/ThemeProvider";
import { ToastProvider } from "../contexts/ToastProvider";
import ProtectedRoute from "../contexts/PrivateRoute";

import Signin from "../pages/Signin";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";

const AppRoutes = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Signin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
              </Route>
              <Route path="*" element={<Signin />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default AppRoutes;
