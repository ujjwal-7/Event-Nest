import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetchUserEvents = (userId, currentPage) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState();
  const { user } = useContext(AuthContext);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/events/hosts/${userId}?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const result = await response.json();

      setEvents(result.data.events);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId, currentPage]);

  return { events, totalPages, isLoading, error };
};

export default useFetchUserEvents;
