import {
  useState
} from "react";

import {
  X,
  Star
} from "lucide-react";

import {
  createReview
} from "../../api/reviewApi";


function ReviewModal({

  order,

  onClose,

  onSuccess

}) {

  const [rating, setRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async () => {

    try {

      setLoading(true);

      await createReview({

        order_id: order.id,

        restaurant_id:
          order.restaurant_id,

        driver_id:
          order.driver_id,

        rating,

        review_text:
          reviewText

      });

      alert(
        "Review submitted successfully"
      );

      onSuccess();

      onClose();

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.detail ||

        "Review failed"

      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <div className="
      fixed
      inset-0
      bg-black/70
      z-50
      flex
      items-center
      justify-center
      p-5
    ">

      <div className="
        w-full
        max-w-[500px]
        bg-[#111827]
        border
        border-white/10
        rounded-[30px]
        p-8
        text-white
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <h2 className="
            text-3xl
            font-black
          ">
            Rate Your Order
          </h2>

          <button
            onClick={onClose}
          >

            <X />

          </button>

        </div>

        {/* STARS */}

        <div className="
          flex
          gap-3
          mb-8
        ">

          {
            [1,2,3,4,5].map((star) => (

              <button
                key={star}
                onClick={() =>
                  setRating(star)
                }
              >

                <Star
                  size={40}
                  fill={
                    star <= rating
                    ? "#f97316"
                    : "transparent"
                  }
                  className="
                    text-orange-400
                  "
                />

              </button>
            ))
          }

        </div>

        {/* TEXT */}

        <textarea

          placeholder="
          Share your experience...
          "

          value={reviewText}

          onChange={(e) =>
            setReviewText(
              e.target.value
            )
          }

          className="
            w-full
            h-[140px]
            rounded-2xl
            bg-white/5
            border
            border-white/10
            p-5
            outline-none
            resize-none
            mb-8
          "
        />

        {/* BUTTON */}

        <button

          onClick={handleSubmit}

          disabled={loading}

          className="
            w-full
            h-14
            rounded-2xl
            bg-orange-500
            hover:bg-orange-400
            transition-all
            duration-300
            font-bold
            text-lg
          "
        >

          {
            loading
            ? "Submitting..."
            : "Submit Review"
          }

        </button>

      </div>

    </div>
  );
}

export default ReviewModal;