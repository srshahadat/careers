"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Application = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string | null;
  cover_letter: string | null;
  resume_url: string;
  resume_filename: string;
  status: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  shortlisted: "bg-blue-100 text-blue-700",
  interview: "bg-purple-100 text-purple-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_OPTIONS = ["pending", "shortlisted", "interview", "rejected", "hired"];

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  async function loadApplications() {
    setLoading(true);
    const res = await fetch("/api/admin/applications");
    if (res.ok) {
      const data = await res.json();
      setApplications(data.applications);
    } else {
      setError("Failed to load applications.");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleStatusChange(id: number, status: string) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  const departments = useMemo(
    () => Array.from(new Set(applications.map((a) => a.department))),
    [applications]
  );

  const filtered = applications.filter((a) => {
    const matchesSearch =
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesDept = deptFilter === "all" || a.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const stats = useMemo(() => {
    const counts: Record<string, number> = { total: applications.length };
    for (const s of STATUS_OPTIONS) {
      counts[s] = applications.filter((a) => a.status === s).length;
    }
    return counts;
  }, [applications]);

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of departments) {
      counts[d] = applications.filter((a) => a.department === d).length;
    }
    return counts;
  }, [applications, departments]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            Log out
          </button>
        </div>

        {/* Status Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          <StatCard label="Total" value={stats.total} />
          {STATUS_OPTIONS.map((s) => (
            <StatCard key={s} label={s} value={stats[s] || 0} />
          ))}
        </div>

        {/* Department Stats */}
        {departments.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3">
            {departments.map((d) => (
              <div
                key={d}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
              >
                <span className="font-semibold text-slate-800">{d}</span>
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                  {deptCounts[d]}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Loading applications...</p>
          ) : error ? (
            <p className="p-6 text-sm text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No applications found.</p>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Specialization</th>
                  <th className="px-4 py-3 font-medium">Resume</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {a.full_name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <div>{a.email}</div>
                      <div>{a.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{a.department}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {a.specialization ? (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold">
                          {a.specialization}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={a.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-brand-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                        className={`rounded-md border-0 px-2 py-1 text-xs font-semibold ${
                          STATUS_STYLES[a.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs capitalize text-slate-500">{label}</div>
    </div>
  );
}
