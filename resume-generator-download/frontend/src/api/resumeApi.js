// resumeApi.js — Handles the API call to the backend
// Kept separate from the component to keep things clean and modular

const API_URL = 'http://localhost:5000/api/generate-resume';

export async function generateResumePDF(formData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  // If the server returned an error, throw so the component can catch it
  if (!response.ok) {
    throw new Error('Failed to generate PDF. Please try again.');
  }

  // Convert the response into a binary Blob (raw PDF bytes)
  const blob = await response.blob();
  return blob;
}