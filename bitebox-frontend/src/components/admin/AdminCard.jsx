function AdminCard({

  children,

  className = ""

}) {

  return (

    <div className={`
      bg-white/[0.03]
      border
      border-white/10
      rounded-[30px]
      p-6
      md:p-7
      backdrop-blur-xl
      shadow-[0_10px_40px_rgba(0,0,0,0.25)]
      ${className}
    `}>

      {children}

    </div>
  );
}

export default AdminCard;