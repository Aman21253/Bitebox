import React from "react";

const variants = {
  default:  "bg-white/10 text-gray-300 border-white/10",
  success:  "bg-green-500/15 text-green-400 border-green-500/20",
  warning:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  danger:   "bg-red-500/15 text-red-400 border-red-500/20",
  info:     "bg-blue-500/15 text-blue-400 border-blue-500/20",
  orange:   "bg-orange-500/15 text-orange-400 border-orange-500/20",
  purple:   "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

const dots = {
  default: "bg-gray-400",
  success: "bg-green-400",
  warning: "bg-yellow-400",
  danger:  "bg-red-400",
  info:    "bg-blue-400",
  orange:  "bg-orange-400",
  purple:  "bg-purple-400",
};

function Badge({ children, variant = "default", dot = false, className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1
        rounded-full
        text-xs font-semibold
        border
        ${variants[variant] ?? variants.default}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dots[variant] ?? dots.default}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export default Badge;