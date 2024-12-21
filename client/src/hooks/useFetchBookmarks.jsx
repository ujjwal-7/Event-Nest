import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetchBookmarks = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);


  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/bookmarks`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const result = await response.json();
      setEvents(result.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  return { events, isLoading, error, refetch: fetchBookmarks };
};

export default useFetchBookmarks;
