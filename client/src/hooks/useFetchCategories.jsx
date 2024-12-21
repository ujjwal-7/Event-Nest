import { useEffect, useState } from "react";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/categories`
      );
      const result = await response.json();
      setCategories(result.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const refetch = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, refetch, isLoading, error };
};

export default useFetchCategories;
