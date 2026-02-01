import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const Skill = () => {
  const [skillName, setSkillName] = useState("");
  const [percent, setPercent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName || !percent) {
      alert("Please fill all fields");
      return;
    }

    if (percent < 0 || percent > 100) {
      alert("Percentage must be 0 - 100");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "skills"), {
        name: skillName,
        percent:    Number(percent),
        createdAt: new Date(),
      });

      alert("Skill Added ✅");
      setSkillName("");
      setPercent("");
    } catch (error) {
      console.error(error);
      alert("Error adding skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-start">
      <div className="bg-white shadow rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Skill
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Name */}
          <div>
            <label className="text-sm text-gray-500">Skill Name</label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="React JS"
              className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Percentage */}
          <div>
            <label className="text-sm text-gray-500">Percentage</label>
            <input
              type="number"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              placeholder="80"
              className="w-full border p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Add Skill"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Skill;
