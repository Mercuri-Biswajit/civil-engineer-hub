import React from 'react';

const Card = ({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  footer,
  noPadding = false,
  ...props
}) => {
  return (
    <div className={`bg-white rounded-lg border border-slate-100 shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${className}`} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-50">
          <div className="flex flex-col gap-1">
            {title && <h3 className="text-base font-bold text-slate-900 m-0">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 m-0">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      
      <div className={`${noPadding ? 'p-0' : 'p-6'}`}>
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
