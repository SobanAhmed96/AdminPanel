import React, { useState } from "react";
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image!");
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
      // Reset form
      setImage(null);
      setTitle("");
      setDescription("");
      setFrontendUrl("");
      setBackendUrl("");
      setLiveDemoUrl("");
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add My Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image upload */}
        <div>
          <label className="block mb-2 font-medium">Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 w-40 h-40 object-cover rounded"
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block mb-2 font-medium">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter project title"
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Project Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter project description"
            className="block w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          ></textarea>
        </div>

        {/* Optional links */}
        <div>
          <label className="block mb-2 font-medium">Frontend GitHub URL (optional)</label>
          <input
            type="url"
            value={frontendUrl}
            onChange={(e) => setFrontendUrl(e.target.value)}
            placeholder="https://github.com/username/frontend"
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Backend GitHub URL (optional)</label>
          <input
            type="url"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            placeholder="https://github.com/username/backend"
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Live Demo URL (optional)</label>
          <input
            type="url"
            value={liveDemoUrl}
            onChange={(e) => setLiveDemoUrl(e.target.value)}
            placeholder="https://yourproject.live"
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
};

export default AddMyProject;
