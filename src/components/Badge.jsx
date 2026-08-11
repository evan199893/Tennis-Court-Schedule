import React from 'react';

export function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}) {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 border border-blue-300',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
