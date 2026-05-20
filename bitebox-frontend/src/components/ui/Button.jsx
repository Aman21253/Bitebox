function Button({
  children,
  loading,
  type = "button",
  onClick,
  className = "",
}) {

  return (

    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`
        w-full
        h-14
        rounded-2xl
        font-bold
        text-white
        transition-all
        duration-300
        bg-orange-500
        hover:bg-orange-400
        hover:scale-[1.02]
        active:scale-[0.98]
        shadow-lg
        shadow-orange-500/20
        disabled:opacity-70
        ${className}
      `}
    >
      {
        loading
          ? "Please wait..."
          : children
      }
    </button>
  );
}

export default Button;