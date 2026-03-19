import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo/My__Logo.png";

export default function GlobalHeader({
  toolTitle,
  toolSubtitle,
  rightActions,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Projects" },
    { path: "/bbs", label: "BBS" },
    { path: "/boq", label: "BOQ" },
    { path: "/structure", label: "Structure" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="h-16 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-slate-100/80 bg-white/95 backdrop-blur-sm sticky top-0 z-[100]">
      {/* Logo & Tool Title */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <img
              src={logo}
              alt="Civil Engineer Hub"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {toolTitle && (
          <div className="hidden sm:flex items-center h-8">
            <div className="w-px h-full bg-slate-200 mx-4"></div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight">
                {toolTitle}
              </span>
              {toolSubtitle && (
                <span className="text-xs font-medium text-slate-400 mt-0.5 leading-tight">
                  {toolSubtitle}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-xl border border-slate-100">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isActive(item.path)
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/60"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              isActive(item.path)
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      {rightActions && (
        <div className="flex items-center gap-3">{rightActions}</div>
      )}
    </header>
  );
}
