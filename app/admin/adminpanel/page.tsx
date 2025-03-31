"use client";
import "bootstrap/dist/css/bootstrap.min.css";

import Sidebar from "../sideBar/page";



export default function adminpanel() {
  return (


        <div className="d-flex" style={{ minHeight: "100vh" }}>
          {/* Sidebar - Fixed */}
          <Sidebar />

          {/* Main Content Area */}
          <main
            className="flex-grow-1 p-4 bg-light"
            style={{
              minHeight: "100vh",
              width: "100%", // Ensure it takes full width
              marginLeft: "20%", // Adjusted to match Sidebar width in percentage
            }}
          >
       
          </main>
        </div>
   
   
  );
}
