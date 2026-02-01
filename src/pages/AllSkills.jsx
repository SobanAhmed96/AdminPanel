import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const AllSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [percent, setPercent] = useState("");

  // FETCH SKILLS
  const fetchSkills = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "skills"));
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete skill?")) return;
    await deleteDoc(doc(db, "skills", id));
    fetchSkills();
  };

  // EDIT CLICK
  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setPercent(skill.percent);
  };

  // UPDATE
  const handleUpdate = async () => {
    if (percent < 0 || percent > 100) {
      alert("Percent must be 0-100");
      return;
    }

    await updateDoc(doc(db, "skills", editingId), {
      name,
      percent: Number(percent),
    });

    setEditingId(null);
    setName("");
    setPercent("");
    fetchSkills();
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Skills</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
          >
            {editingId === skill.id ? (
              <>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="number"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />

                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800">
                  {skill.name}
                </h2>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${skill.percent}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {skill.percent}%
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(skill.id)}
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

export default AllSkills;
