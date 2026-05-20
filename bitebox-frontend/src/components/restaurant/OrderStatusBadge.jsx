function OrderStatusBadge({
  status,
}) {

  const getStyles = () => {

    switch (status) {

      case "pending":
        return `
          bg-yellow-500/10
          text-yellow-300
          border-yellow-500/20
        `;

      case "confirmed":
        return `
          bg-blue-500/10
          text-blue-300
          border-blue-500/20
        `;

      case "preparing":
        return `
          bg-orange-500/10
          text-orange-300
          border-orange-500/20
        `;

      case "delivered":
        return `
          bg-green-500/10
          text-green-300
          border-green-500/20
        `;

      default:
        return `
          bg-white/5
          text-gray-300
          border-white/10
        `;
    }
  };

  return (

    <div className={`
      px-4
      py-2
      rounded-2xl
      border
      text-sm
      font-bold
      capitalize
      ${getStyles()}
    `}>

      {status || "pending"}

    </div>
  );
}

export default OrderStatusBadge;