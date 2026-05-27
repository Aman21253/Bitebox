import React from "react";

function Button({
  children,
  loading = false,
  type = "button",
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  icon = null,
  fullWidth = true,
  tooltip = null,
}) {
  const variants = {
    primary: `
      bg-orange-500
      hover:bg-orange-400
      text-white
      shadow-orange-500/20
    `,
    secondary: `
      bg-white/10
      hover:bg-white/20
      text-white
      border
      border-white/10
    `,
    success: `
      bg-green-500
      hover:bg-green-400
      text-white
      shadow-green-500/20
    `,
    danger: `
      bg-red-500
      hover:bg-red-400
      text-white
      shadow-red-500/20
    `,
    ghost: `
      bg-transparent
      hover:bg-white/10
      text-white
      border
      border-white/10
    `,
    warning: `
      bg-yellow-500
      hover:bg-yellow-400
      text-white
      shadow-yellow-500/20
    `,
    outline: `
      bg-transparent
      hover:bg-orange-500/10
      text-orange-400
      border
      border-orange-500/40
      hover:border-orange-400
    `,
  };

  const sizes = {
    xs: `h-8 px-3 text-xs`,
    sm: `h-11 px-4 text-sm`,
    md: `h-14 px-6 text-base`,
    lg: `h-16 px-8 text-lg`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-disabled={loading || disabled}
      title={tooltip}
      className={`
        ${fullWidth ? "w-full" : ""}
        rounded-2xl
        font-bold
        flex
        items-center
        justify-center
        gap-3
        transition-all
        duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-60
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-orange-500/50
        focus:ring-offset-2
        focus:ring-offset-transparent
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : icon}

      <span>
        {loading ? "Please wait..." : children}
      </span>
    </button>
  );
}

export default Button;