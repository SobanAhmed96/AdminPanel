import React, { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("Soban Ahmed");
  const [email, setEmail] = useState("soban@email.com");
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert("Settings Saved!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Profile Info
          </h2>

          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Security</h2>

          <div>
            <label className="text-sm text-gray-500">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Appearance</h2>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-1 rounded text-white ${
                darkMode ? "bg-gray-800" : "bg-gray-400"
              }`}
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
