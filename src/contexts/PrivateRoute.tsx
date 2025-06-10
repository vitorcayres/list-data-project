import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function PrivateRoute() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Carregando..</h1>;
  }

  if (user === null) {
    return <Navigate to="/" />;
  }

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
}

export default PrivateRoute;
