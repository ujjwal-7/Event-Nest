import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetchProfiletDetails = (userId) => {
  const [profileDetails, setProfileDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchProfileDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.explaination);
      }

      setProfileDetails(result.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [userId]);

  return { profileDetails, isLoading, error };
};

export default useFetchProfiletDetails;
