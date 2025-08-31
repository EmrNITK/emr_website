import { useState } from "react";
import { showToast } from "../utils/toast";

export const useApiRequest = ({ enableToast }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = async (fetchData, successMessage = "Request successful") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData();
      setData(response.data);
      
      if (enableToast) {
        showToast.success(successMessage);
      }
      
      return response;
    } catch (err) {
      let errorMessage = "Something went wrong.";
      let errorDetails = "";

      // Handle different types of errors
      if (err?.response) {
        // Axios error with response
        const { status, data } = err.response;
        
        if (status >= 400 && status < 500) {
          // Client-side validation errors
          if (data?.errors && Array.isArray(data.errors)) {
            errorDetails = data.errors.map(e => `${e.path}: ${e.msg}`).join(', ');
          } else if (data?.message) {
            errorDetails = data.message;
          }
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err?.status) {
        // Fetch error with status
        const { status } = err;
        
        if (status >= 400 && status < 500) {
          try {
            const res = await err.json();
            if (res?.errors && Array.isArray(res.errors)) {
              errorDetails = res.errors.map(e => `${e.path}: ${e.msg}`).join(', ');
            } else if (res?.message) {
              errorDetails = res.message;
            }
          } catch (parseError) {
            errorDetails = "Invalid response format";
          }
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else {
        // Generic error (network, etc.)
        errorMessage = err?.message || "Network error. Please check your connection.";
      }

      setError(errorMessage);
      showToast.error(errorDetails || errorMessage);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error, data };
};
