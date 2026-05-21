import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem(
      "access_token"
    );

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;