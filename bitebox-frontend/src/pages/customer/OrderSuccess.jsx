import {
  useNavigate,
  useParams,
} from "react-router-dom";

function OrderSuccess() {

  const navigate = useNavigate();

  const { orderId } = useParams();

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
      items-center
      justify-center
      px-5
    ">

      <div className="
        w-full
        max-w-[700px]
        rounded-[40px]
        bg-white/[0.03]
        border
        border-white/10
        p-12
        text-center
      ">

        <div className="
          text-8xl
          mb-6
        ">
          🎉
        </div>

        <h1 className="
          text-5xl
          font-black
          mb-5
        ">
          Order Confirmed
        </h1>

        <p className="
          text-gray-400
          text-lg
          leading-relaxed
        ">
          Your order has been placed successfully.
        </p>

        <div className="
          mt-10
          bg-white/5
          rounded-3xl
          p-8
          border
          border-white/10
        ">

          <p className="
            text-gray-400
            mb-2
          ">
            Order ID
          </p>

          <h2 className="
            text-4xl
            font-black
            text-orange-400
          ">
            #{orderId}
          </h2>

          <p className="
            mt-5
            text-gray-300
          ">
            Estimated delivery:
            {" "}
            <span className="
              text-orange-400
              font-bold
            ">
              25-30 mins
            </span>
          </p>

        </div>

        <button
          onClick={() => navigate("/")}
          className="
            mt-10
            w-full
            h-16
            rounded-2xl
            bg-orange-500
            hover:bg-orange-400
            transition
            text-xl
            font-black
          "
        >
          Back To Home
        </button>

      </div>

    </div>
  );
}

export default OrderSuccess;