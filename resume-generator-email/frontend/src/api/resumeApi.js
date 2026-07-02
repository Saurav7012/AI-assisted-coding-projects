// resumeApi.js — Handles the API call to the backend

const API_URL = 'http://localhost:5000/api/generate-resume';

export async function sendResumeByEmail(formData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  // If the server returned an error, throw so the component can catch it
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send resume. Please try again.');
  }

  return data; // { message: '...', sentTo: '...' }
}