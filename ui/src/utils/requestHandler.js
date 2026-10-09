const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Error with the HTTP status and the parsed body, so callers can tell 429/413/422 apart.
const buildError = async (response) => {
  const errorData = await response.json().catch(() => ({}));
  const error = new Error(
    typeof errorData.detail === 'string' ? errorData.detail : `Server error: ${response.status}`
  );
  error.status = response.status;
  error.body = errorData;
  return error;
};

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
    throw await buildError(response);
  }

  return response.json();
};

/**
 * Sends a GET request to the API and handles errors safely.
 */
export const sendGetRequest = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw await buildError(response);
  }

  return response.json();
};

/**
 * Sends a DELETE request to the API and handles errors safely.
 */
export const sendDeleteRequest = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });

  if (!response.ok) {
    throw await buildError(response);
  }

  return response.json();
};
