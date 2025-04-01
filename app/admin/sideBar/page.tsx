"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";


interface MenuItem {
  label: string;
  path: string;
}

interface SidebarItemProps {
  label: string;
  path: string;
  active: boolean;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const menuItems: MenuItem[] = [
    { label: "Admin Home", path: "/admin/Dashboard_data" },
    { label: "Highlights", path: "/admin/highlights" },
    { label: "News & Articles", path: "/admin/news_articles" },
    { label: "Users", path: "/admin/user" },
    { label: "Subscribers", path: "/admin/subscribers" },
//{ label: "Subscribers", path: "/admin/userList" },
    { label: "Settings", path: "/admin/smtp_settings" },
    { label: "Site Info", path: "/admin/edit-user" },
  ];

  return (
    <aside
      className="d-flex flex-column text-white px-3 py-3 position-fixed"
      style={{
        height: "100vh",
        width: "200px",
        backgroundColor: "#03A696", // green 
        borderTopRightRadius: "40px", // for curve
        top: 0,
        left: 0,
      }}
    >
      {/* Logo */}
       <div
        className="text-center mb-3 position-relative"
        style={{ width: "100%", height: "90px", padding: "10px" }}
      >
        <Image
          src="/lab_logo.png"
          alt="Company Logo"
          fill
          style={{ objectFit: "contain" }}
          className="img-fluid rounded"
          priority
        />
      </div> 

      {/* Navigation Menu */}
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              path={item.path}
              active={currentPath === item.path}
            />
          ))}
        </ul>
      </nav>

      {/* Fixed Logout Button */}
      <div
        className="d-flex justify-content-center"
        style={{
          position: "absolute",
          bottom: "60px",
          left: "40%",
          transform: "translateX(-50%)",
          width: "100%",
          textAlign: "center",
        }}
      >
        <button
          className="btn border border-white bg-white text-primary d-flex align-items-center justify-content-between px-3 py-1 rounded-pill"
          style={{
            width: "100px",
            height: "40px",
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => alert("Are you sure you want to log out?")}
        >
          <span className="flex-grow-1 text-start text-black">Logout</span>
          <span
            className="d-flex align-items-center justify-content-center rounded-circle w-7xl h-2.5"
            style={{
          
              height: "20px",
              backgroundColor: "#03A696",
              color: "white",
            }}
          >
            ➜
          </span>
        </button>
      </div>
    </aside>
  );
}

// Sidebar Item Component
function SidebarItem({ label, path, active }: SidebarItemProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <li className="nav-item">
      <a
        className="nav-link fw-bold"
        href={path}
        onClick={handleClick}
        style={{
          transition: "background-color 0.3s ease-in-out",
          display: "block",
          fontSize: "16px",
          padding: "12px 20px",
          width: active ? "calc(100% + 28px)" : "100%",
          marginLeft: active ? "-10px" : "0px",
          marginRight: active ? "-20px" : "0px",
          borderRadius: active ? "30px 0px 0px 30px" : "8px",
          backgroundColor: active ? "#f8f9fa" : "transparent",
          color: active ? "black" : "white",
        }}
      >
        {label}
      </a>
    </li>
  );
}



