"use client"; 
import Sidebar from "@/app/admin/sideBar/page";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Manage sidebar state

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: "100vh", transition: "all 0.3s ease-in-out" }}
    >
      {/* Sidebar - Fixed */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <main
        className="flex-grow-1 p-4 bg-light"
        style={{
          minHeight: "100vh",
          width: "100%",
          marginLeft: isSidebarOpen ? "200px" : "0", // Adjust based on sidebar state
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {children}
      </main>
    </div>
  );
}
