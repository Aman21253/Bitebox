import { Navigate } from "react-router-dom";

function RoleProtectedRoute({
  children,
  allowedRoles,
}) {

  const token =
    localStorage.getItem(
      "access_token"
    );

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // NOT LOGGED IN

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // WRONG ROLE

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    // CLEAR BAD SESSION

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ALLOWED

  return children;
}

export default RoleProtectedRoute;