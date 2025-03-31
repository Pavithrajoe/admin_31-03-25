"use client";

import { useEffect, useState } from "react";
import { getUsers } from "../APILayer/CreateUser";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

interface User {
  id: number;
  username: string;
  email: string;
  role: number;
  company_id: string;
  is_active: boolean;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getUsers();
        setUsers(result);
        console.log("The result is", result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
   
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">User List</h2>
      {users.map((user) => (
        <div key={user.id} className="p-4 border rounded shadow">
          <div>
            <strong>{user.username}</strong> ({user.email})
          </div>
          <div>Role: {user.role}</div>
          <div>Status: {user.is_active ? "Active" : "Inactive"}</div>
          <div className="mt-2">
            <button
              onClick={() => router.push(`/admin/edit-user/${user.id}`)} // ✅ Navigate to edit-user/[id]
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              
              Edit
            </button>
        
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
