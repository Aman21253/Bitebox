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
        transition
        bg-black
        hover:bg-gray-900
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