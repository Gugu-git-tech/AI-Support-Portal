import { useEffect, useState, type FormEvent } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { getUser, getToken } from "@/lib/auth";
import {
createUser as apiCreateUser,
deleteUser,
getUsers,
type User,
updateUserRole,
} from "@/services/api";

export default function AdminUsers() {
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [saving, setSaving] = useState(false);
const [activeRoleUpdate, setActiveRoleUpdate] = useState<string | null>(null);
const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
const [newEmail, setNewEmail] = useState("");
const [newPassword, setNewPassword] = useState("");
const [newRole, setNewRole] = useState("agent");

const currentUser = getUser();
const token = getToken(); // ✅ FIXED

async function fetchUsers() {
if (!token) {
setError("Missing admin token. Please sign in again.");
setLoading(false);
return;
}
try {
  setLoading(true);
  const data = await getUsers(token);
  setUsers(data);
  setError("");
} catch (err: any) {
  setError(err?.message || "Unable to load users.");
} finally {
  setLoading(false);
}


}

async function handleRoleChange(userId: string, role: string) {
if (!token) return;

setError("");
setSuccess("");
setActiveRoleUpdate(userId);

try {
  await updateUserRole(userId, role, token);
  await fetchUsers();
  setSuccess("User role updated successfully.");
} catch (err: any) {
  setError(err?.message || "Unable to update role.");
} finally {
  setActiveRoleUpdate(null);
}


}

async function handleDeleteUser(userId: string) {
if (!token) return;


if (userId === currentUser?.id) {
  setError("You cannot delete your own account while signed in.");
  return;
}

setError("");
setSuccess("");
setDeletingUserId(userId);

try {
  await deleteUser(userId, token);
  await fetchUsers();
  setSuccess("User deleted successfully.");
} catch (err: any) {
  setError(err?.message || "Unable to delete user.");
} finally {
  setDeletingUserId(null);
}


}

async function handleCreateUser(e: FormEvent) {
e.preventDefault();
setError("");
setSuccess("");


if (!newEmail || !newPassword) {
  setError("Email and password are required.");
  return;
}

if (!newEmail.includes("@")) {
  setError("Enter a valid email address.");
  return;
}

if (newPassword.length < 4) {
  setError("Password must be at least 4 characters.");
  return;
}

if (!token) {
  setError("Missing admin token. Please sign in again.");
  return;
}

try {
  setSaving(true);
  await apiCreateUser(newEmail, newPassword, newRole, token);
  setNewEmail("");
  setNewPassword("");
  setNewRole("agent");
  await fetchUsers();
  setSuccess("User created successfully.");
} catch (err: any) {
  setError(err?.message || "Unable to create user.");
} finally {
  setSaving(false);
}


}

useEffect(() => {
fetchUsers();
}, [token]);

return ( <DashboardShell title="User Access" navItems={adminNav} requiredRole="admin"> <div className="p-6"> <h1 className="text-xl font-bold">Admin Users Panel</h1>


    {error && (
      <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700">
        {error}
      </div>
    )}

    {success && (
      <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
        {success}
      </div>
    )}

    <table className="w-full mt-4 border">
      <thead>
        <tr>
          <th className="text-left p-3">Email</th>
          <th className="text-left p-3">Role</th>
          <th className="text-left p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-4 text-sm">
              {loading ? "Loading users..." : "No users found."}
            </td>
          </tr>
        ) : (
          users.map((u: User) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                <select
                  value={u.role}
                  disabled={activeRoleUpdate === u.id}
                  onChange={(e) =>
                    handleRoleChange(u.id, e.target.value)
                  }
                  className="rounded border px-3 py-2 text-sm"
                >
                  <option value="user">user</option>
                  <option value="agent">agent</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="p-3">
                <button
                  type="button"
                  disabled={
                    deletingUserId === u.id ||
                    activeRoleUpdate === u.id ||
                    u.id === currentUser?.id
                  }
                  onClick={() => handleDeleteUser(u.id)}
                  className="rounded bg-red-500 px-3 py-1 text-sm text-white disabled:opacity-60"
                >
                  {deletingUserId === u.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    <div className="mt-6">
      <h2 className="text-lg font-semibold">Create User / Agent</h2>

      <form
        onSubmit={handleCreateUser}
        className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
      >
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email@company.com"
          className="w-full rounded border px-3 py-2"
        />

        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="password"
          type="password"
          className="w-full rounded border px-3 py-2"
        />

        <div className="flex gap-2">
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="agent">Agent</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
</DashboardShell>


);
}
