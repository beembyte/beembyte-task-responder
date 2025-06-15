import { longFormatters } from "date-fns";

// Format price to currency (₦Naira)
export const formatNaira = (amount: number): string => {
  // Show as ₦ and with no decimal places by default
  return `₦${(amount || 0).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
};

// Format price to currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date to readable string
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
};

// Format date to month and year
export const formatMonthYear = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
};

// Generate random price for demo purposes
export const generatePrice = (min: number = 15, max: number = 100): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Handle file size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
};
