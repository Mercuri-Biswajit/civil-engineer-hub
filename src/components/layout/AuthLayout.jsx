import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fcfdfe]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.4]" style={{ 
          backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full opacity-40 blur-[100px] bg-indigo-100 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full opacity-30 blur-[100px] bg-pink-100 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-indigo-600 shadow-2xl shadow-indigo-200">
            <span className="text-white text-4xl font-bold">⬡</span>
          </div>
          <div className="space-y-2">
            {title && <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{title}</h1>}
            {subtitle && (
              <p className="text-base text-slate-500 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Children (Card) */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
