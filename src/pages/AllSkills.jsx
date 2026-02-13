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
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [percent, setPercent] = useState("");
  const [errors, setErrors] = useState({});

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
    setErrors({});
  };

  // UPDATE
  const handleUpdate = async () => {
    const nextErrors = {};
    const numericPercent = Number(percent);
    if (!name.trim()) nextErrors.name = "Skill name is required.";
    if (Number.isNaN(numericPercent)) {
      nextErrors.percent = "Percent must be a number.";
    } else if (numericPercent < 0 || numericPercent > 100) {
      nextErrors.percent = "Percent must be between 0 and 100.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await updateDoc(doc(db, "skills", editingId), {
      name: name.trim(),
      percent: numericPercent,
    });

    setEditingId(null);
    setName("");
    setPercent("");
    setErrors({});
    fetchSkills();
  };

  const filteredSkills = skills.filter((skill) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (skill.name || "").toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
              <div className="mt-4 h-3 w-full rounded-full bg-slate-100 animate-pulse" />
              <div className="mt-2 h-3 w-12 rounded bg-slate-100 animate-pulse" />
              <div className="mt-4 h-8 w-24 rounded-lg bg-slate-100 animate-pulse" />
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
              Skills
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              All Skills
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {skills.length} total skills
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 sm:w-64"
            />
            <button
              onClick={fetchSkills}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 transition sm:w-auto"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-8 sm:p-10 text-center">
          <p className="text-sm text-slate-500">No skills found.</p>
          <p className="mt-2 text-xs text-slate-400">
            Try a different search or add a new skill.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {editingId === skill.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">
                      Skill name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                        errors.name ? "border-red-300" : "border-slate-200"
                      }`}
                      placeholder="Skill name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600">
                      Percent
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={percent}
                      onChange={(e) => {
                        setPercent(e.target.value);
                        setErrors((prev) => ({ ...prev, percent: "" }));
                      }}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${
                        errors.percent ? "border-red-300" : "border-slate-200"
                      }`}
                      placeholder="0 - 100"
                    />
                    {errors.percent && (
                      <p className="mt-2 text-xs text-red-500">
                        {errors.percent}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={handleUpdate}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {skill.name}
                      </h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Skill level
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {skill.percent}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{ width: `${skill.percent}%` }}
                    ></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="rounded-full bg-amber-500 px-3 py-1 text-xs text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="rounded-full bg-rose-600 px-3 py-1 text-xs text-white"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllSkills;
