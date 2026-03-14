export function extractErrorMessage(error: any, fallback = "Something went wrong. Please try again."): string {
  const raw =
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.message ||
    fallback;

  return normalizeUserMessage(String(raw || fallback));
}

export function normalizeUserMessage(message: string): string {
  const text = (message || "").trim();
  if (!text) return "Something went wrong. Please try again.";

  const lower = text.toLowerCase();

  if (lower.includes("invalid promo") || lower.includes("promo code does not exist")) {
    return "This promo code is not valid. Please check and try again.";
  }

  if (lower.includes("promo code not available") || lower.includes("promo code is expired")) {
    return "This promo code is no longer available.";
  }

  if (lower.includes("promo code is not active")) {
    return "This promo code is not active yet.";
  }

  if (lower.includes("unauthorized") || lower.includes("invalid token")) {
    return "Your session has expired. Please login again.";
  }

  if (lower.startsWith("http ")) {
    return "Request failed. Please try again.";
  }

  return text;
}
