"use client";

import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../APILayer/CreateUser";

const EditUser = ({ userId, onClose }: { userId: number; onClose: () => void }) => {
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserById(userId);
        console.log("The role is ", result.role);
        setUser(result);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setUser((prevUser: any) => ({
      ...prevUser,
      [name]:
        name === "is_active"
          ? value === "true" // ✅ Convert string to boolean
          : name === "role"
          ? Number(value) // ✅ Convert to number for role
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateUser(userId, user);
      alert("User updated successfully");
      onClose(); // Close edit form after success
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div>Loading user details...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Edit User</h2>

      {/* Username */}
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={user.username || ""}
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
          value={user.email || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Role */}
      <label htmlFor=""></label>
      <input type="text" value={user.role||''}
      onChange={handleChange}/>

      {/* Status */}
      <div>
        <label>Status:</label>
        <select
          name="is_active"
          value={user.is_active ? "true" : "false"}
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
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default EditUser;
