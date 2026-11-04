import { isAxiosError } from "axios";

// Uses the message sent by the API (e.g. "Bike is linked to a sale…") when there is one
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  return fallback;
};
