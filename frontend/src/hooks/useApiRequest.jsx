import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useApiRequest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = async (fetchData, successMessage = "Request successful") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData();

      // If response is successful (status 2xx)
      if (response?.status >= 200 && response?.status < 300) {
        setData(response.data);
        toast({
          title: "Success",
          description: successMessage,
          variant: "success",
          className:
            "bg-green-800 text-white shadow-lg border border-green-500",
        });
        return response;
      }

      // If response indicates an error (status 4xx, 5xx)
      throw response;
    } catch (err) {
      let errorMessage = "Something went wrong.";
      let errorDetails = "";

      const { status } = err;
      const res = await err.json();

      if (status >= 400 && status < 500) {
        // Client-side validation errors
        if (!Array.isArray(res.errors) && !res?.success) {
          errorDetails = res.message;
        } else {
          errorDetails = (
            <div>
              {" "}
              {res.errors?.map((e, index) => (
                <div key={index}>{`${e.path}: ${e.msg}`}</div>
              ))}
            </div>
          );
        }
      } else if (status >= 500) {
        // Server-side errors
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorDetails || errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error, data };
};
