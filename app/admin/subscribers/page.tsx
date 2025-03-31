"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Manually adding 25 subscribers for testing
    const testSubscribers = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      company_id: `C${1000 + index}`,
      subscriber_email: `user${index + 1}@example.com`,
      subscription_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: index % 2 === 0, // Even-indexed subscribers are active
    }));

    setSubscribers(testSubscribers);
    setLoading(false);
  }, []);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    if (filter === "all") return true;
    return filter === "active" ? subscriber.is_active : !subscriber.is_active;
  });

  return (
    <div className="container-fluid d-flex justify-content-center align-items-start px-2 py-1">
      <div className="p-2 rounded w-100">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fw-bold">Subscribers</h2>
          <div className="btn-group">
            <button className={`btn filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              All Subscribers
            </button>
            <button className={`btn filter-button ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
              Active
            </button>
            <button className={`btn filter-button ${filter === "inactive" ? "active" : ""}`} onClick={() => setFilter("inactive")}>
              Inactive
            </button>
          </div>
        </div>

        <div className="table-responsive rounded">
          {loading ? (
            <p className="text-muted text-center">Loading...</p>
          ) : (
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Company ID</th>
                  <th>Email</th>
                  <th>Subscription Date</th>
                  <th>Updated At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber, index) => (
                  <tr key={subscriber.id} className={selectedRow === index ? "table-primary" : ""} onClick={() => setSelectedRow(index)}>
                    <td>#{subscriber.id}</td>
                    <td>{subscriber.company_id}</td>
                    <td>{subscriber.subscriber_email}</td>
                    <td>{new Date(subscriber.subscription_date).toLocaleDateString()}</td>
                    <td>{new Date(subscriber.updated_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${subscriber.is_active ? "active-badge" : "inactive-badge"}`}>
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style jsx>{`
        .filter-button {
          background: linear-gradient(to bottom, #6bdcff, #008cba);
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 20px;
          border: none;
          transition: all 0.3s ease-in-out;
          text-align: center;
          cursor: pointer;
        }

        .filter-button:hover {
          background: linear-gradient(to bottom, #008cba, #6bdcff);
          transform: scale(1.05);
        }

        .filter-button:active {
          transform: scale(0.95);
        }

        .active {
          background: linear-gradient(to bottom, #004d73, #0078a8);
          border: 2px solid #004d73;
        }

        .table th, .table td {
          text-align: center;
          font-size: 14px;
          vertical-align: middle;
        }

        .table tbody tr {
          height: 50px;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 17px;
          font-weight: bold;
          color: white;
          text-align: center;
          min-width: 80px;
          font-size: 14px; 
        }

        .active-badge {
          background-color: rgb(21, 141, 77);
        }

        .inactive-badge {
          background-color: rgb(179, 34, 29);
        }
      `}</style>
    </div>
  );
}
