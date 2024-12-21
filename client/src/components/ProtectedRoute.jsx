import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { OrderContext } from "../context/OrderContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { orderDetails } = useContext(OrderContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    location.pathname === "/order" &&
    (!orderDetails || !orderDetails.eventId)
  ) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
