import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useCurrentUser } from "../../auth/useCurrentUser";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useCurrentUser();

  if (!token) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  return children;
};