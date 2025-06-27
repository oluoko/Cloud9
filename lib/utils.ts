import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the initials of a user from the first and second names
 * @param firstName string representing the first name
 * @param secondName string respresenting the second name
 * @returns Initials of the user's name
 */
export function getInitials(firstName: string, secondName: string): string {
  return `${firstName[0]}.${secondName[0]}`;
}

/**
 * Extract an image key from an image URL
 * @param src string representing the URL of the image
 * @returns Image Key of an image
 */
export function getImageKey(src: string) {
  return src.substring(src.lastIndexOf("/") + 1);
}
export function generateRandomSixDigitNumber(): string {
  const randomNum = Math.floor(100000 + Math.random());
  const randomSixDigitString = randomNum.toString().padStart(6, "0");
  return randomSixDigitString;
}

export function generateRandomFourDigiUserId() {
  const randomNum = Math.floor(1000 + Math.random());
  const randomFourDigitString = randomNum.toString().padStart(4, "0");
  return randomFourDigitString;
}

export default function convertToSubcurrency(amout: number, factor = 100) {
  return Math.round(amout * factor);
}

/**
 * Format a date string or Date object into a human-readable format
 * @param date Date string or Date object to format
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    return dateObj.toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
}

/**
 * Format a time string into a standardized format
 * @param time Time string to format
 * @returns Formatted time string
 */
export function formatTime(time: string | undefined): string {
  if (!time) return "N/A";

  try {
    // Handle different time formats
    // If time is in 24-hour format (HH:MM)
    if (/^\d{1,2}:\d{2}$/.test(time)) {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    // If time already includes AM/PM
    if (/^\d{1,2}:\d{2}\s?[AP]M$/i.test(time)) {
      return time;
    }

    return time;
  } catch (error) {
    console.error("Error formatting time:", error);
    return time;
  }
}

export function formatISODateToTime(
  isoDate: string | Date | undefined
): string | undefined {
  if (!isoDate) return undefined;

  const date = new Date(isoDate);

  // Format time as HH:MM with timezone info
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}

/**
 * Format currency with appropriate locale and currency code
 * @param amount Amount to format
 * @param currency Currency code (default: KES)
 * @param locale Locale to use for formatting (default: en-US)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | undefined,
  currency = "KES",
  locale = "en-US"
): string {
  if (amount === undefined || amount === null) return `${currency} 0.00`;

  try {
    // For KES, which doesn't have a standard symbol in many fonts,
    // we'll use the currency code before the amount
    if (currency === "KES") {
      return `${currency} ${amount.toFixed(2)}`;
    }

    // For other currencies, use the Intl formatter
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currency} ${amount}`;
  }
}

/**
 * Generate a shortened version of a string with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string | undefined, maxLength = 20): string {
  if (!str) return "";
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
}

/**
 * Extract specified number of words from a paragraph based on a collection of search strings
 * @param searchStrings Collection of strings to search for in the paragraph
 * @param paragraph The paragraph to extract words from
 * @param wordCount Number of words to return from the paragraph
 * @returns Array of words extracted from the paragraph
 */
export function extractWords(
  searchStrings: string[],
  paragraph: string,
  wordCount: number
): string[] {
  if (!paragraph || wordCount <= 0) return [];

  const words = paragraph.split(/\s+/).filter((word) => word.length > 0);

  // If searchStrings is provided and not empty, filter words that contain any of the search strings
  if (searchStrings && searchStrings.length > 0) {
    const filteredWords = words.filter((word) =>
      searchStrings.some((searchStr) =>
        word.toLowerCase().includes(searchStr.toLowerCase())
      )
    );
    return filteredWords.slice(0, wordCount);
  }

  // If no search strings provided, return first N words
  return words.slice(0, wordCount);
}

/**
 * Get the first specified number of words from a paragraph
 * @param paragraph The paragraph to extract words from
 * @param wordCount Number of words to return
 * @returns Array of the first N words from the paragraph
 */
export function getFirstWords(paragraph: string, wordCount: number): string {
  if (!paragraph || wordCount <= 0) return "";

  const words = paragraph.split(/\s+/).filter((word) => word.length > 0);
  return words.slice(0, wordCount).join(" ");
}

export function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 *
 * Type '"destructive" | "secondary" | "success" | "warning"' is not assignable to type '"default" | "destructive" | "outline" | "secondary" | null | undefined'.
  Type '"success"' is not assignable to type '"default" | "destructive" | "outline" | "secondary" | null | undefined'.ts(2322)
badge.tsx(10, 7): The expected type comes from property 'variant' which is declared here on type 'IntrinsicAttributes & BadgeProps'
 */
export function getStatusBadgeVariant2(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}

export function getStatusBadgeVariant3(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Capitalize a string with special handling for camelCase
 * @param str String to capitalize
 * @param preserveAcronyms Whether to preserve acronyms (default: true)
 * @returns Capitalized string
 */
export function capitalize(
  str: string | undefined,
  preserveAcronyms = true
): string {
  if (!str) return "";

  // If the string is in camelCase, split it into separate words
  if (/^[a-z][a-zA-Z0-9]*$/.test(str) && /[A-Z]/.test(str)) {
    // Split the camelCase string
    // This regex looks for patterns where a lowercase letter is followed by an uppercase letter
    // and inserts a space between them
    const words = str.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");

    return words
      .map((word) => {
        // For acronyms (words with all uppercase letters)
        if (
          preserveAcronyms &&
          word === word.toUpperCase() &&
          word.length > 1
        ) {
          return word;
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  // Handle normal strings or single words
  if (str.includes(" ")) {
    // If the string already contains spaces, capitalize each word
    return str
      .split(" ")
      .map((word) => {
        if (
          preserveAcronyms &&
          word === word.toUpperCase() &&
          word.length > 1
        ) {
          return word;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }

  // Basic capitalization for simple strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
