/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}