import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetchUserOrders = (userId, currentPage) => {
  const [orders, setOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState();
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/orders/users/${userId}?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const result = await response.json();
      setOrders(result.data.orders);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, currentPage]);

  return { orders, totalPages, isLoading, error };
};

export default useFetchUserOrders;
