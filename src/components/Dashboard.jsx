import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  FolderOpenIcon,
  WrenchScrewdriverIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      to: "/AddProject",
      label: "Add My Project",
      short: "+",
      icon: PlusCircleIcon,
      hover: "hover:bg-blue-100/70",
    },
    {
      to: "/project",
      label: "Projects",
      short: "P",
      icon: FolderOpenIcon,
      hover: "hover:bg-emerald-100/70",
    },
    {
      to: "/skills",
      label: "Skills",
      short: "SK",
      icon: WrenchScrewdriverIcon,
      hover: "hover:bg-emerald-100/70",
    },
    {
      to: "/Allskills",
      label: "All Skills",
      short: "ASK",
      icon: Squares2X2Icon,
      hover: "hover:bg-emerald-100/70",
    },
    {
      to: "/settings",
      label: "Settings",
      short: "S",
      icon: Cog6ToothIcon,
      hover: "hover:bg-violet-100/70",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white/95 backdrop-blur border-r border-slate-200 shadow-sm transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${isOpen ? "md:w-64" : "md:w-16"}`}
      >
        {/* Logo / Dashboard title */}
        <div
          onClick={() => navigate("/")}
          className={`p-5 cursor-pointer text-xl font-semibold text-slate-900 border-b border-slate-200 flex items-center justify-between ${
            !isOpen && "md:justify-center md:text-lg"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-600 text-white flex items-center justify-center text-sm font-bold">
              MD
            </div>
            {isOpen && (
              <span className="whitespace-nowrap overflow-hidden">
                My Dashboard
              </span>
            )}
          </div>

          {/* Toggle Button inside sidebar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="ml-2 hidden p-2 rounded-lg hover:bg-slate-100 focus:outline-none md:inline-flex"
          >
            {isOpen ? (
              <XMarkIcon className="h-5 w-5 text-slate-700" />
            ) : (
              <Bars3Icon className="h-5 w-5 text-slate-700" />
            )}
          </button>
        </div>
        {/* Navigation Links */}
        <nav className="mt-4 flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    title={!isOpen ? item.label : undefined}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden ${
                        item.hover
                      } ${
                        isActive
                          ? "bg-slate-900 text-white shadow"
                          : "text-slate-700"
                      } ${!isOpen ? "md:justify-center md:px-0" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            isActive
                              ? "text-white"
                              : "text-slate-500 group-hover:text-slate-700"
                          }`}
                        />
                        {isOpen ? (
                          <span className="flex-1">{item.label}</span>
                        ) : (
                          <span className="sr-only">{item.label}</span>
                        )}
                        {isOpen && (
                          <span className="text-xs text-slate-400">
                            {item.short}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Optional bottom footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
              MM
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  Maaz Malik
                </p>
                <p className="text-xs text-slate-500 truncate">Admin</p>
              </div>
            )}
          </div>
          <p
            className={`mt-4 text-xs text-slate-500 text-center ${
              !isOpen ? "hidden" : "block"
            }`}
          >
            © 2026 My Dashboard
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur border-b border-slate-200 px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Admin Panel
              </p>
              <h1 className="text-xl font-semibold text-slate-900">
                Dashboard Overview
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <button className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition">
                View Site
              </button>
              <button className="px-3 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition">
                New Update
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
