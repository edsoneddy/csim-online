const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Sends a POST request to the API and handles errors safely.
 */
export const sendPostRequest = async (endpoint, payload) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error: ${response.status}`);
  }

  return response.json();
};
