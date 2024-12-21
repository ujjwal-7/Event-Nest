import { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetchEvents = (filters, currentPage) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState();
  const { user } = useContext(AuthContext);

  const fetchEvents = useCallback(async () => {
    const queryParams = new URLSearchParams();
    if (filters?.search) queryParams.append("search", filters?.search);
    if (filters?.categories && filters.categories.length > 0)
      queryParams.append("categories", filters.categories.join(","));
    if (filters?.priceSort) queryParams.append("price", filters.priceSort);
    queryParams.append("date", filters.dateSort || "desc");

    queryParams.append("page", currentPage || 1);

    setIsLoading(true);

    const headers = {
      "Content-Type": "application/json",
    };

  
    if (user && user.token) {
      headers["Authorization"] = `Bearer ${user.token}`;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events?${queryParams.toString()}`,
        {
          headers,
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setEvents(result.data.events);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [filters, fetchEvents, currentPage]);

  return { events, totalPages, isLoading, error };
};

export default useFetchEvents;
