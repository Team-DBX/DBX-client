import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

const useGetData = (initialUrl: string) => {
  const [value, setValue] = useState<AxiosResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(initialUrl);
        setValue(response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setFetchError(error.message);
        } else if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError("An unknown error occurred.");
        }
      }
    };
    fetchData();
  }, [initialUrl]);

  return { value, fetchError };
};

export default useGetData;
