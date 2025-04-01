"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const testUsers = Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      user_id: `U${1000 + index}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: index % 2 === 0 ? "Admin" : "User",
      status: index % 2 === 0 ? "Active" : "Inactive",
    }));

    setUsers(testUsers);
    setLoading(false);
  }, []);

  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user
      )
    );
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">User Management</h2>
        <button className="custom-add-button" onClick={() => router.push("/admin/createusers")}>
          Add User
        </button>
      </div>

      <div className="table-responsive">
        {loading ? (
          <p className="text-muted text-center">Loading...</p>
        ) : (
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-danger btn-sm me-2">Delete</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(user.id)}>
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style jsx>{`
        .custom-add-button {
          background: linear-gradient(to right, #004d7a, #0083b0);
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 8px 20px;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          transition: 0.3s ease-in-out;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .custom-add-button:hover {
          background: linear-gradient(to right, #003d5c, #006f99);
        }
        
        .badge {
        font-size: 12px;
        font-weight: bold;
        padding: 7px 14px;
        border-radius: 18px;
      }

      .badge-active {
        background-color: #28a745; /* Green for Active */
        color: white;
      }

      .badge-inactive {
        background-color: #dc3545; /* Red for Inactive */
        color: white;
      }

      `}</style>
    </div>
  );
}