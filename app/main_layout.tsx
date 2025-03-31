"use client";

import Sidebar from "@/app/admin/sideBar/page";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <div className="d-flex" style={{ minHeight: "100vh" }}>
          {/* Sidebar - Fixed */}
          <Sidebar />

          {/* Main Content Area */}
          <main
            className="flex-grow-1 p-4 bg-light"
            style={{
              minHeight: "100vh",
              width: "100%", // Ensure it takes full width
              marginLeft: "200px", // Adjust if necessary
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
