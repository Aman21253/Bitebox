import React from "react";

function Card({
  children,
  className = "",
  padding = "default",
  hover = false,
  glow = false,
  onClick = null,
  as: Tag = "div",
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    default: "p-6 md:p-7",
    lg: "p-8 md:p-10",
  };

  return (
    <Tag
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(e) : undefined}
      className={`
        bg-white/[0.03]
        border
        border-white/10
        rounded-[30px]
        backdrop-blur-xl
        transition-all
        duration-300
        ${hover ? `
          hover:border-orange-500/20
          hover:bg-white/[0.05]
          hover:-translate-y-1
          cursor-pointer
        ` : ""}
        ${glow ? "shadow-lg shadow-orange-500/5" : ""}
        ${onClick ? "focus:outline-none focus:ring-2 focus:ring-orange-500/40" : ""}
        ${paddings[padding] ?? paddings.default}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}

export default Card;