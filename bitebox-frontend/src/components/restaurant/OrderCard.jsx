import {
  Bike,
  IndianRupee,
  MapPin,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";

function OrderCard({
  order,
  updateStatus,
  autoAssignDriver,
}) {

  return (

    <div className="
      relative
      overflow-hidden
      rounded-[32px]
      border
      border-white/10
      bg-white/[0.03]
      backdrop-blur-2xl
      p-7
      hover:border-orange-500/30
      hover:-translate-y-1
      hover:shadow-[0_20px_80px_rgba(249,115,22,0.12)]
      transition-all
      duration-500
    ">

      {/* GLOW */}

      <div className="
        absolute
        top-[-50px]
        right-[-40px]
        w-[150px]
        h-[150px]
        rounded-full
        bg-orange-500/10
        blur-[70px]
      " />

      {/* HEADER */}

      <div className="
        relative
        z-10
        flex
        items-start
        justify-between
        gap-5
        mb-7
      ">

        <div>

          <p className="
            text-gray-400
            text-sm
            mb-2
          ">
            Order ID
          </p>

          <h2 className="
            text-4xl
            font-black
          ">
            #{order.id}
          </h2>

        </div>

        <OrderStatusBadge
          status={order.status}
        />

      </div>

      {/* DETAILS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
      ">

        {/* AMOUNT */}

        <div className="
          bg-white/[0.03]
          border
          border-white/10
          rounded-2xl
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">

            <IndianRupee
              size={20}
              className="
                text-orange-400
              "
            />

            <p className="
              text-gray-400
              text-sm
            ">
              Total Amount
            </p>

          </div>

          <h3 className="
            text-3xl
            font-black
            text-orange-400
          ">
            ₹{order.total_amount || 0}
          </h3>

        </div>

        {/* DELIVERY */}

        <div className="
          bg-white/[0.03]
          border
          border-white/10
          rounded-2xl
          p-5
        ">

          <div className="
            flex
            items-center
            gap-3
            mb-4
          ">

            <Bike
              size={20}
              className="
                text-orange-400
              "
            />

            <p className="
              text-gray-400
              text-sm
            ">
              Delivery Status
            </p>

          </div>

          <h3 className="
            text-lg
            font-bold
            capitalize
          ">
            {
              order.delivery_status ||
              "pending"
            }
          </h3>

        </div>

      </div>

      {/* ADDRESS */}

      <div className="
        mt-6
        bg-white/[0.03]
        border
        border-white/10
        rounded-2xl
        p-5
      ">

        <div className="
          flex
          items-center
          gap-3
          mb-3
        ">

          <MapPin
            size={18}
            className="
              text-orange-400
            "
          />

          <p className="
            text-sm
            text-gray-400
          ">
            Delivery Address
          </p>

        </div>

        <p className="
          text-lg
          leading-relaxed
        ">
          {
            order.delivery_address ||
            "No address"
          }
        </p>

      </div>

      {/* ACTIONS */}

      <div className="
        flex
        flex-wrap
        gap-4
        mt-7
      ">

        <button
          onClick={() =>
            updateStatus(
              order.id,
              "confirmed"
            )
          }
          className="
            px-5
            py-3
            rounded-2xl
            bg-blue-500/10
            border
            border-blue-500/20
            text-blue-300
            font-bold
          "
        >
          Confirm
        </button>

        <button
          onClick={() =>
            updateStatus(
              order.id,
              "preparing"
            )
          }
          className="
            px-5
            py-3
            rounded-2xl
            bg-orange-500/10
            border
            border-orange-500/20
            text-orange-300
            font-bold
          "
        >
          Preparing
        </button>

        <button
          onClick={() =>
            updateStatus(
              order.id,
              "delivered"
            )
          }
          className="
            px-5
            py-3
            rounded-2xl
            bg-green-500/10
            border
            border-green-500/20
            text-green-300
            font-bold
          "
        >
          Delivered
        </button>

        <button
          onClick={() =>
            autoAssignDriver(
              order.id
            )
          }
          className="
            px-5
            py-3
            rounded-2xl
            bg-white/[0.05]
            border
            border-white/10
            text-white
            font-bold
          "
        >
          Auto Assign Driver
        </button>

      </div>

    </div>
  );
}

export default OrderCard;