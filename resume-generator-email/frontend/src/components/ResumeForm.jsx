// ResumeForm.jsx — Resume form wired to the backend

import { useState } from 'react';
import { sendResumeByEmail } from '../api/resumeApi';

function ResumeForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    skills: '',
    projectTitle: '',
    projectDescription: '',
  });

  // Tracks whether we're waiting for the backend to respond
  const [isLoading, setIsLoading] = useState(false);

  // Holds any error message to show the user
  const [error, setError] = useState('');

  // Holds success info after email is sent
  const [successEmail, setSuccessEmail] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear success/error state when user starts editing again
    setSuccessEmail('');
    setError('');
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessEmail('');
    setIsLoading(true);

    try {
      const result = await sendResumeByEmail(formData);
      // Show success message with the email it was sent to
      setSuccessEmail(result.sentTo);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">

      {/* Page heading */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Resume Generator</h1>
        <p className="text-base-content/70 mt-2">
          Fill in your details and receive a professional PDF resume by email
        </p>
      </div>

      {/* Form card */}
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* ---- PERSONAL INFORMATION ---- */}
            <h2 className="card-title text-lg mb-4 border-b border-base-300 pb-2">
              Personal Information
            </h2>

            {/* Full Name */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Saurav Kumar"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Email and Phone side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. saurav@email.com"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>

            {/* ---- EDUCATION ---- */}
            <h2 className="card-title text-lg mt-6 mb-4 border-b border-base-300 pb-2">
              Education
            </h2>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Education Details</span>
                <span className="label-text-alt text-base-content/50">
                  Degree, University, Year
                </span>
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech in Computer Science, XYZ University, 2024"
                className="textarea textarea-bordered w-full h-24"
                required
              />
            </div>

            {/* ---- SKILLS ---- */}
            <h2 className="card-title text-lg mt-6 mb-4 border-b border-base-300 pb-2">
              Skills
            </h2>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Skills</span>
                <span className="label-text-alt text-base-content/50">
                  Comma separated
                </span>
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. JavaScript, React, Node.js, MongoDB"
                className="textarea textarea-bordered w-full h-24"
                required
              />
            </div>

            {/* ---- PROJECT ---- */}
            <h2 className="card-title text-lg mt-6 mb-4 border-b border-base-300 pb-2">
              Project
            </h2>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Project Title</span>
              </label>
              <input
                type="text"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                placeholder="e.g. CodeRunner"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Project Description</span>
              </label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder="Briefly describe what the project does and the tech used..."
                className="textarea textarea-bordered w-full h-28"
                required
              />
            </div>

            {/* Success message (shows after email is sent) */}
            {successEmail && (
              <div className="alert alert-success mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Resume sent to <strong>{successEmail}</strong>. Check your inbox!</span>
              </div>
            )}

            {/* Error message (shows only if something went wrong) */}
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit button — shows spinner while loading */}
            <button
              type="submit"
              className="btn btn-primary w-full text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Sending to your email...
                </>
              ) : (
                'Generate PDF & Send to Email'
              )}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default ResumeForm;