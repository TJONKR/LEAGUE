/**
 * Check if a string is a valid URL
 */
export function isValidUrl(str: string | null | undefined): str is string {
  if (!str || str.trim() === "") return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}


