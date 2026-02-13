import React, { useEffect, useState } from "react";
import { db } from "../firebase.js"; // Firebase Firestore
import { collection, addDoc, Timestamp } from "firebase/firestore";
import axios from "axios";

const AddMyProject = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frontendUrl, setFrontendUrl] = useState("");
  const [backendUrl, setBackendUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetForm = () => {
    setImage(null);
    setPreviewUrl("");
    setTitle("");
    setDescription("");
    setFrontendUrl("");
    setBackendUrl("");
    setLiveDemoUrl("");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!image) nextErrors.image = "Please select a project image.";
    if (!title.trim()) nextErrors.title = "Project title is required.";
    if (!description.trim()) {
      nextErrors.description = "Project description is required.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "maazportflio"); // Cloudinary unsigned preset
      // Optional: formData.append("folder", "projects");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dgy2rpwcu/image/upload",
        formData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;

      // 2️⃣ Save project data to Firestore
      await addDoc(collection(db, "projects"), {
        title,
        description,
        frontendUrl: frontendUrl || "",
        backendUrl: backendUrl || "",
        liveDemoUrl: liveDemoUrl || "",
        imageUrl, // store Cloudinary URL
        createdAt: Timestamp.now(),
      });

      alert("Project added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6 sm:py-5 rounded-t-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">
            Add My Project
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload a hero image and fill the details to publish your project.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="Enter project title"
                  className={`mt-2 block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                    errors.title ? "border-red-300" : "border-slate-200"
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Project Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="Short summary, features, and stack"
                  className={`mt-2 block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                    errors.description ? "border-red-300" : "border-slate-200"
                  }`}
                  rows={5}
                />
                {errors.description && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Frontend GitHub URL
                  </label>
                  <input
                    type="url"
                    value={frontendUrl}
                    onChange={(e) => setFrontendUrl(e.target.value)}
                    placeholder="https://github.com/username/frontend"
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Backend GitHub URL
                  </label>
                  <input
                    type="url"
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    placeholder="https://github.com/username/backend"
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://yourproject.live"
                  className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <label className="block text-sm font-medium text-slate-700">
                  Project Image
                </label>
                <p className="mt-1 text-xs text-slate-400">
                  PNG or JPG, recommended 1200x800.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
                />
                {errors.image && (
                  <p className="mt-2 text-xs text-red-500">{errors.image}</p>
                )}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Project preview"
                      className="h-40 w-full rounded-lg object-cover sm:h-48"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 sm:h-48">
                      Image preview will appear here
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800">
                  Publishing checklist
                </h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-500">
                  <li>Use a clear title with product keywords.</li>
                  <li>Keep descriptions concise and feature-focused.</li>
                  <li>Prefer a live demo link when possible.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Fields marked as required must be completed before submitting.
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={resetForm}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-100 transition sm:w-auto"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-5 py-2 rounded-xl text-sm text-white transition sm:w-auto ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {loading ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMyProject;
