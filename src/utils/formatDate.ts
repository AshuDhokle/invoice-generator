import { format } from "date-fns";

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "Invalid Date"; // Handle undefined or null cases

  const parsedDate = new Date(dateString); // Convert string to Date object
  if (isNaN(parsedDate.getTime())) return "Invalid Date"; // Handle invalid dates

  return format(parsedDate, "dd-mm-yyyy"); 
};
