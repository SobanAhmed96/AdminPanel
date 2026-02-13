import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frontendUrl, setFrontendUrl] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // FETCH
  const fetchProjects = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "projects"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  };

  // EDIT CLICK
  const handleEditClick = (project) => {
    setEditingProject(project.id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setFrontendUrl(project.frontendUrl || "");
    setBackendUrl(project.backendUrl || "");
    setLiveDemoUrl(project.liveDemoUrl || "");
    setImageUrl(project.imageUrl || "");
  };

  // UPDATE
  const handleUpdate = async () => {
    await updateDoc(doc(db, "projects", editingProject), {
      title,
      description,
      frontendUrl,
      backendUrl,
      liveDemoUrl,
      imageUrl,
    });

    setEditingProject(null);
    fetchProjects();
  };

  const filteredProjects = projects.filter((project) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const titleMatch = (project.title || "").toLowerCase().includes(query);
    const descMatch = (project.description || "").toLowerCase().includes(query);
    return titleMatch || descMatch;
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="h-36 sm:h-40 rounded-xl bg-slate-100 animate-pulse" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100 animate-pulse" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Projects
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              All Projects
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {projects.length} total projects
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 sm:w-64"
            />
            <button
              onClick={fetchProjects}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 transition sm:w-auto"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-8 sm:p-10 text-center">
          <p className="text-sm text-slate-500">No projects found.</p>
          <p className="mt-2 text-xs text-slate-400">
            Try a different search or add a new project.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-36 sm:h-40 w-full rounded-t-2xl object-cover"
                />
              ) : (
                <div className="flex h-36 sm:h-40 items-center justify-center rounded-t-2xl bg-slate-100 text-xs text-slate-400">
                  No image uploaded
                </div>
              )}

              <div className="p-4">
                {editingProject === project.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Title
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Title"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Frontend URL
                      </label>
                      <input
                        value={frontendUrl}
                        onChange={(e) => setFrontendUrl(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Frontend URL"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Backend URL
                      </label>
                      <input
                        value={backendUrl}
                        onChange={(e) => setBackendUrl(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Backend URL"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Live Demo URL
                      </label>
                      <input
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Live Demo URL"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">
                        Image URL
                      </label>
                      <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                        placeholder="Image URL"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={handleUpdate}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {project.title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEditClick(project)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white"
                        >
                          Live
                        </a>
                      )}

                      {project.frontendUrl && (
                        <a
                          href={project.frontendUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-emerald-600 px-3 py-1 text-xs text-white"
                        >
                          Frontend
                        </a>
                      )}

                      {project.backendUrl && (
                        <a
                          href={project.backendUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-violet-600 px-3 py-1 text-xs text-white"
                        >
                          Backend
                        </a>
                      )}

                      <button
                        onClick={() => handleDelete(project.id)}
                        className="rounded-full bg-rose-600 px-3 py-1 text-xs text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProjects;
