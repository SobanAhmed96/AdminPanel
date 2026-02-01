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

  if (loading) {
    return <div className="p-6 text-xl">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back 👋 Manage your portfolio here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">Visitors</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">—</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm">Messages</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">—</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Projects
        </h2>

        {recentProjects.length === 0 ? (
          <p className="text-gray-500">No projects found.</p>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <span className="text-gray-700 font-medium">
                  {project.title}
                </span>

                <span className="text-sm text-gray-500">
                  {project.createdAt?.toDate
                    ? project.createdAt.toDate().toLocaleDateString()
                    : "No date"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-blue-700">
            Add New Project
          </h3>
          <p className="text-sm text-blue-600 mt-1">
            Showcase your latest work.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-green-700">
            Manage Projects
          </h3>
          <p className="text-sm text-green-600 mt-1">
            Edit or delete existing projects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
