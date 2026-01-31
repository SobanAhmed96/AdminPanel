import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-white shadow-md transition-all duration-300 flex flex-col relative`}
      >
        {/* Logo / Dashboard title */}
        <div
          onClick={() => navigate("/")}
          className={`p-6 cursor-pointer text-2xl font-bold text-gray-800 border-b flex items-center justify-between ${
            !isOpen && "justify-center p-6 text-lg"
          }`}
        >
          <span className="whitespace-nowrap overflow-hidden">
            {isOpen ? "My Dashboard" : "MD"}
          </span>

          {/* Toggle Button inside sidebar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 p-1 rounded hover:bg-gray-200 focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="h-5 w-5 text-gray-700" />
            ) : (
              <Bars3Icon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1">
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/AddProject"
                className={`block px-6 py-3 text-gray-700 hover:bg-blue-100 rounded font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden ${
                  !isOpen && "text-center px-0"
                }`}
              >
                {isOpen ? "Add My Project" : "+"}
              </Link>
            </li>

            <li>
              <Link
                to="/projects"
                className={`block px-6 py-3 text-gray-700 hover:bg-green-100 rounded font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden ${
                  !isOpen && "text-center px-0"
                }`}
              >
                {isOpen ? "Projects" : "P"}
              </Link>
            </li>

            <li>
              <Link
                to="/settings"
                className={`block px-6 py-3 text-gray-700 hover:bg-purple-100 rounded font-medium transition-colors duration-200 whitespace-nowrap overflow-hidden ${
                  !isOpen && "text-center px-0"
                }`}
              >
                {isOpen ? "Settings" : "S"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Optional bottom footer */}
        <div className="p-6 border-t text-gray-500 text-sm text-center">
          {isOpen ? "© 2026 My Dashboard" : "©"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
