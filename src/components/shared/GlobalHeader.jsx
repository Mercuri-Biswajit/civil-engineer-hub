import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo/My__Logo.png';

export default function GlobalHeader({ toolTitle, toolSubtitle, rightActions }) {
  const navigate = useNavigate();

  return (
    <header className="h-[80px] min-h-[80px] px-4 md:px-8 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-[100] shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => navigate('/')}>
          <img src={logo} alt="Urban Matrix Logo" className="h-9 w-auto drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
        </div>
        {toolTitle && (
          <div className="flex items-center h-8 ml-2">
            <div className="w-[1px] h-full bg-slate-200 mx-5"></div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-none">{toolTitle}</span>
              {toolSubtitle && <span className="text-[11px] font-semibold text-slate-400 mt-1 leading-none">{toolSubtitle}</span>}
            </div>
          </div>
        )}
      </div>

      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
        {[
          { path: '/', label: 'Projects' },
          { path: '/bbs', label: 'BBS' },
          { path: '/boq', label: 'BOQ' },
          { path: '/structure', label: 'Structure' }
        ].map((item) => {
          const isActive = window.location.pathname === item.path || (item.path !== '/' && window.location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {rightActions && (
        <div className="flex items-center gap-3">
          {rightActions}
        </div>
      )}
    </header>
  );
}

