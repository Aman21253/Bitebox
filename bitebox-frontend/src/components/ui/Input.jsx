function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div className="space-y-3">

      <label className="
        text-sm
        font-semibold
        text-gray-300
      ">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          w-full
          h-14
          px-5
          rounded-2xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          text-white
          placeholder:text-gray-500
          outline-none
          transition-all
          duration-300
          focus:border-orange-500
          focus:ring-4
          focus:ring-orange-500/10
        "
      />

    </div>
  );
}

export default Input;