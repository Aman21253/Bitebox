function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {

  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-gray-700">
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
          border-gray-300
          bg-gray-50
          text-gray-800
          outline-none
          transition
          focus:border-orange-500
          focus:ring-4
          focus:ring-orange-100
        "
      />

    </div>
  );
}

export default Input;