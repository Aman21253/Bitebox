import React from "react";

function Input({
  label,
  error,
  helperText,
  icon,
  rightIcon,
  className = "",
  type = "text",
  multiline = false,
  rows = 4,
  required = false,
  optional = false,
  ...props
}) {
  const baseClass = `
    w-full
    rounded-2xl
    border
    bg-white/[0.05]
    text-white
    outline-none
    transition-all
    duration-300
    placeholder:text-gray-500
    focus:ring-4
    ${icon ? "pl-12" : "px-5"}
    ${rightIcon ? "pr-12" : "pr-5"}
    ${error
      ? `border-red-500 focus:border-red-400 focus:ring-red-500/20`
      : `border-white/10 focus:border-orange-500 focus:ring-orange-500/10`
    }
    ${className}
  `;

  return (
    <div className="space-y-2">

      {/* LABEL */}
      {label && (
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-1">
          {label}
          {required && <span className="text-orange-400" aria-label="required">*</span>}
          {optional && <span className="text-gray-500 font-normal text-xs">(optional)</span>}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div className="relative">

        {/* LEFT ICON */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        {/* INPUT or TEXTAREA */}
        {multiline ? (
          <textarea
            rows={rows}
            {...props}
            className={`${baseClass} py-4 resize-none`}
          />
        ) : (
          <input
            type={type}
            {...props}
            className={`${baseClass} h-14`}
          />
        )}

        {/* RIGHT ICON */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {/* ERROR / HELPER */}
      {error ? (
        <p className="text-red-400 text-sm font-medium flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-gray-500 text-sm">{helperText}</p>
      ) : null}
    </div>
  );
}

export default Input;