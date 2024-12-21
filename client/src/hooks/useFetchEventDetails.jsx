import { useEffect, useState } from "react";

const useFetchEventDetails = (eventId) => {
  const [event, setEvent] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/events/${eventId}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.explaination);
      }

      setEvent(result.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  return { event, isLoading, error };
};

export default useFetchEventDetails;
