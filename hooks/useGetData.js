import { useState, useEffect } from "react";
import axios from "axios";

const useGetData = initialUrl => {
  const [value, setValue] = useState("");
  const [fetchError, setFetchError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(initialUrl);
        setValue(response);
      } catch (error) {
        setFetchError(error);
      }
    };
    fetchData();
  }, [initialUrl]);

  return { value, fetchError };
};

export default useGetData;
