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

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        All Projects
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
          >
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />

            {editingProject === project.id ? (
              <>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Title"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Description"
                />

                <input
                  value={frontendUrl}
                  onChange={(e) => setFrontendUrl(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Frontend URL"
                />

                <input
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Backend URL"
                />

                <input
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Live Demo URL"
                />

                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Image URL"
                />

                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProject(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">
                  {project.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  {project.description}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Live
                    </a>
                  )}

                  {project.frontendUrl && (
                    <a
                      href={project.frontendUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Frontend
                    </a>
                  )}

                  {project.backendUrl && (
                    <a
                      href={project.backendUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Backend
                    </a>
                  )}

                  <button
                    onClick={() => handleEditClick(project)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
