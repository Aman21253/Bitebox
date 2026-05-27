function AdminSkeleton({

  height = "h-24"

}) {

  return (

    <div className={`
      w-full
      rounded-3xl
      bg-white/5
      animate-pulse
      ${height}
    `} />
  );
}

export default AdminSkeleton;