"use client";
import '../styles/dashboard.css';

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// TypeScript Types
type TopBlogger = {
  username: string;
  blog_count: number;
};

type Blog = {
  id: number;
  blog_content: any;
  created_at: string;
  users: { username: string };
};

type Product = {
  id: number;
  content: string;
  created_at: string;
};

type UploadingLevel = {
  month: string;
  count: number;
};

type SubscriberTraffic = {
  month: string;
  activeSubscribers: number;
  inactiveSubscribers: number;
};

type DashboardData = {
  totals: {
    blogs: number;
    products: number;
    subscribers: number;
    activeSubscribers: number;
    inactiveSubscribers: number;
    users: number;
  };
  topBlogger: TopBlogger | null;
  latestBlogs: Blog[];
  latestProducts: Product[];
  uploadingLevel: {
    blogs: UploadingLevel[];
    products: UploadingLevel[];
  };
  superAdmin: string;
  totalRoles: number;
  subscriberTraffic: SubscriberTraffic[];
  activeUsers: number;
  inactiveUsers: number;
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error("Failed to load data");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (


    <div className="parent p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Totals Section */}
      <div className="col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-6 gap-2">
        {[
          { label: "Total Blogs", value: data.totals.blogs },
          { label: "Total Products", value: data.totals.products },
          { label: "Total Subscribers", value: data.totals.subscribers },
          { label: "Active Subscribers", value: data.totals.activeSubscribers },
          { label: "Inactive Subscribers", value: data.totals.inactiveSubscribers },
          { label: "Total Users", value: data.totals.users },
        ].map((item, index) => (
          <div key={index} className="cards  bg-white shadow rounded-lg  hover:bg-blue-100 transition-transform">
            <div className="text-gray-500 text-sm">{item.label}</div>
            <div className="text-2xl font-semibold">{item.value}</div>
          </div>
        ))}
      </div>

   
      {/* Latest Blogs */}
      <div className="col-span-1 lg:col-span-2 bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Latest Blogs</h3>
        <ul className="space-y-2">
          {data.latestBlogs.map((blog) => (
            <li key={blog.id} className="border-b pb-2">
              <p className="font-medium">
                {blog.blog_content?.[0]?.text || "No content available"}
              </p>
              <small className="text-gray-500">
                by {blog.users.username} on{" "}
                {new Date(blog.created_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col gap-6 p-0'>
      {/* Latest Products */}
      <div className="col-span-1 max-h-fit bg-white  shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Latest Products</h3>
        <ul className="space-y-2">
          {data.latestProducts.map((product) => (
            <li key={product.id} className="border-b pb-2">
              <p className="font-medium">{product.content || "No content"}</p>
              <small className="text-gray-500">
                Created on{" "}
                {new Date(product.created_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      </div>
         {/* Top Blogger */}
      <div className=" col-span-1 max-w-full  h-full lg:col-span-3 bg-white  shadow rounded-lg place-items-center">
        <h3 className="text-lg font-semibold mb-2 p-0.5">Top Blogger</h3>
        <p className="text-gray-700">
          {data.topBlogger ? (
            <>
              <strong className='text-black text-2xl'>{data.topBlogger.username}</strong> with{" "}
              <strong className='text-black text-2xl'>{data.topBlogger.blog_count}</strong> blogs
            </>
          ) : (
            "No blogger data available"
          )}
        </p>
      </div>
  </div>
      {/* Blog Uploading Level */}
      <div className="col-span-1 lg:col-span-3 bg-white p-6 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Blog Uploading Level</h3>
        {data.uploadingLevel.blogs?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.uploadingLevel.blogs}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No blog data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
