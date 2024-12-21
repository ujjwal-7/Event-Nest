import { useEffect, useState } from "react";

const useFetchRelatedEvents = (eventId) => {
  const [relatedEvents, setRelatedEvents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState();

  const fetchRelatedEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/related-events/${eventId}`
      );
      const result = await response.json();
      setRelatedEvents(result.data);
      setTotalPages(result.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchRelatedEvents();
  }, [eventId]);


  return { relatedEvents, totalPages, isLoading, error };
};

export default useFetchRelatedEvents;
