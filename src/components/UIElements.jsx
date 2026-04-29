import React from 'react';

export const Button3D = ({ children, onClick, color = 'yellow', style = {}, disabled = false, className = "" }) => {
  const colorClass = `btn-${color}`;
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`btn-3d ${colorClass} ${className}`}
      style={{ ...style, opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {children}
    </button>
  );
};

export const Card3D = ({ children, style = {}, className = "" }) => {
  return (
    <div className={`glass ${className}`} style={{ padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', ...style }}>
      {children}
    </div>
  );
};

export const Badge = ({ children, color = 'var(--primary-yellow)', style = {} }) => {
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '900',
      background: color,
      color: 'white',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
      ...style
    }}>
      {children}
    </span>
  );
};
