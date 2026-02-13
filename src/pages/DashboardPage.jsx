import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const DashboardPage = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TOTAL PROJECTS
        const snapshot = await getDocs(collection(db, "projects"));
        setTotalProjects(snapshot.size);

        // RECENT PROJECTS (last 5)
        const recentQuery = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const recentSnap = await getDocs(recentQuery);
        const recentData = recentSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecentProjects(recentData);
      } catch (err) {
        console.error("Dashboard Error:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (value) => {
    if (!value?.toDate) return "No date";
    return value.toDate().toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-56 rounded-lg bg-slate-200 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`stat-${index}`}
              className="h-28 rounded-2xl bg-white border border-slate-200 shadow-sm p-6"
            >
              <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
              <div className="mt-4 h-8 w-16 rounded bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`row-${index}`}
                className="h-10 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Overview
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Welcome back. Manage your portfolio and recent activity here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-100 transition">
              Export
            </button>
            <button className="px-4 py-2 rounded-xl bg-slate-900 text-sm text-white hover:bg-slate-800 transition">
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-slate-500">Total Projects</h3>
            <span className="text-xs rounded-full bg-blue-50 px-2 py-1 text-blue-600">
              All time
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {totalProjects}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Active portfolio items
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-slate-500">Visitors</h3>
            <span className="text-xs rounded-full bg-emerald-50 px-2 py-1 text-emerald-600">
              Last 30 days
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">—</p>
          <p className="mt-2 text-xs text-slate-400">
            Connect analytics to track views
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-slate-500">Messages</h3>
            <span className="text-xs rounded-full bg-violet-50 px-2 py-1 text-violet-600">
              This week
            </span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">—</p>
          <p className="mt-2 text-xs text-slate-400">
            No inbox connected
          </p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Projects
          </h2>
          <button className="text-sm text-slate-500 hover:text-slate-800 transition">
            View all
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500">No projects found.</p>
            <p className="mt-2 text-xs text-slate-400">
              Add your first project to see it here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {project.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    Project ID: {project.id}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {formatDate(project.createdAt)}
                  </span>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] text-slate-600">
                    Draft
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900">
            Add New Project
          </h3>
          <p className="mt-2 text-sm text-blue-700">
            Showcase your latest work with a new project entry.
          </p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-sm text-white hover:bg-blue-700 transition">
            Create Project
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-900">
            Manage Projects
          </h3>
          <p className="mt-2 text-sm text-emerald-700">
            Update, reorder, or archive existing portfolio items.
          </p>
          <button className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-700 transition">
            Open Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
