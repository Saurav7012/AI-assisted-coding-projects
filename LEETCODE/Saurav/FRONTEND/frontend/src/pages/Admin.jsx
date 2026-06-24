// pages/Admin.jsx
import { NavLink } from "react-router-dom";

export default function Admin() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>

      <NavLink
        to="/admin/create-problem"
        className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition duration-300 cursor-pointer"
      >
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl">Create Problem</h2>
          <p className="text-gray-500 mt-2">
            Add a new problem to the system quickly and easily.
          </p>
          <button className="btn btn-success mt-4">Go</button>
        </div>
      </NavLink>
    </div>
  );
}
