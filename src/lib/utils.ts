import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { TRPCClientError } from "@trpc/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown): string => {
  console.log(error);

  if (error instanceof ZodError) {
    return error.errors[0]?.message ?? "Validation error";
  }

  if (error instanceof TRPCClientError) {
    const parsedError = JSON.parse(error.message) as { message: string }[];
    return parsedError[0]?.message ?? "Error occurred";
  }

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    const parsedError = error as { message: string }[];
    return parsedError[0]?.message ?? "Error occurred";
  }

  if (error && typeof error === "object") {
    const errorObj = error as { message?: unknown };
    if (typeof errorObj.message === "string") {
      return errorObj.message;
    }
    if (Array.isArray(errorObj.message)) {
      const parsedError = errorObj.message as { message: string }[];
      return parsedError[0]?.message ?? "Error occurred";
    }
  }

  return "An unknown error occurred";
};
