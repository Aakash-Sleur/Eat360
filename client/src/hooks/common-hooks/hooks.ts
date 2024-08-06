import { useState, useEffect } from "react";

import {
  useDeleteRecipeById,
  useGetRecipeById,
} from "@/lib/react-query/queries-and-mutations";

const useRecipe = (recipeId: string) => {
  const { data: recipe, isLoading, isError } = useGetRecipeById(recipeId);
  const { mutateAsync: deleteRecipeById } = useDeleteRecipeById();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteRecipe = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteRecipeById(id);
    } catch (error) {
      console.error("Failed to delete recipe", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    recipe,
    isLoading,
    isError,
    isDeleting,
    deleteRecipe,
  };
};

const useOrigin = () => {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  return origin;
};

// https://codesandbox.io/s/react-query-debounce-ted8o?file=/src/useDebounce.js
function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed ...
    // .. within the delay period. Timeout gets cleared and restarted.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-call effect if value or delay changes

  return debouncedValue;
}

export { useRecipe, useOrigin, useDebounce };
