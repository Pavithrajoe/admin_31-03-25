"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserById, updateUser } from "@/app/APILayer/CreateUser";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  company_id?: string;
  is_active: boolean;
}

const EditUser = () => {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserById(Number(id));
        setUser(result);
     
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setUser((prevUser) =>
      prevUser
        ? {
            ...prevUser,
            [name]:
              name === "is_active"
                ? value === "true" // ✅ Convert to boolean for is_active only
                : value,
          }
        : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      await updateUser(Number(id), user);
      setError(null);
      alert("User updated successfully");
      router.push("/admin/userList"); // ✅ Redirect after update
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading user details...</div>;


  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Edit User</h2>
      
      {/* Username */}
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={user?.username || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user?.email || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Role */}
      <div>
        <label>Role:</label>
        <select
          name="role"
          value={user?.role || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="Admin">Admin</option>
          <option value="Superadmin">Super Admin</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* Company ID */}
      <div>
        <label>Company ID:</label>
        <input
          type="text"
          name="company_id"
          value={user?.company_id || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Optional"
        />
      </div>

      {/* Status */}
      <div>
        <label>Status:</label>
        <select
          name="is_active"
          value={user?.is_active ? "true" : "false"}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={!user}
      >
        Save
      </button>
    </form>
   {error && <p className="text-red-500 mt-2">{error}</p>}
   </div>
  );
};

export default EditUser;
