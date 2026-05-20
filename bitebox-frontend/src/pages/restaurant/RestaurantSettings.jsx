import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import RestaurantLayout from "../../layouts/RestaurantLayout";

function RestaurantSettings() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      cuisine: "",
      phone: "",
      image_url: "",
      banner_image: "",
      delivery_radius: 5,
      delivery_fee: 40,
      minimum_order: 199,
      estimated_delivery_time: 30,
      is_open: true,
      opening_time: "",
      closing_time: "",
    });

  useEffect(() => {

    fetchSettings();

  }, []);

  const fetchSettings = async () => {

    try {

      const response = await API.get(
        "/restaurant/settings"
      );

      setFormData(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setSaving(true);

      await API.put(
        "/restaurant/settings",
        formData
      );

      alert(
        "Settings updated successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Failed to update settings"
      );

    } finally {

      setSaving(false);
    }
  };

  if (loading) {

    return (

      <RestaurantLayout>

        <div className="
          h-screen
          flex
          items-center
          justify-center
          text-4xl
          font-black
        ">
          Loading Settings...
        </div>

      </RestaurantLayout>
    );
  }

  return (

    <RestaurantLayout>

      <div className="
        max-w-[1100px]
        mx-auto
        px-8
        py-10
      ">

        <div className="mb-10">

          <p className="
            text-orange-400
            uppercase
            tracking-[3px]
            text-xs
            font-bold
            mb-3
          ">
            Restaurant Panel
          </p>

          <h1 className="
            text-5xl
            font-black
          ">
            Restaurant Settings
          </h1>

        </div>

        <form
          onSubmit={handleSubmit}
          className="
            space-y-8
          "
        >

          <div className="
            bg-white/[0.03]
            border
            border-white/10
            rounded-[32px]
            p-8
          ">

            <h2 className="
              text-3xl
              font-black
              mb-8
            ">
              Basic Information
            </h2>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            ">

              <input
                type="text"
                name="name"
                placeholder="Restaurant Name"
                value={formData.name}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

              <input
                type="text"
                name="cuisine"
                placeholder="Cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

              <input
                type="text"
                name="image_url"
                placeholder="Logo URL"
                value={formData.image_url}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full
                h-32
                mt-6
                rounded-2xl
                bg-white/[0.04]
                border
                border-white/10
                p-5
              "
            />

          </div>

          {/* DELIVERY */}

          <div className="
            bg-white/[0.03]
            border
            border-white/10
            rounded-[32px]
            p-8
          ">

            <h2 className="
              text-3xl
              font-black
              mb-8
            ">
              Delivery Settings
            </h2>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            ">

              <input
                type="number"
                name="delivery_radius"
                placeholder="Delivery Radius"
                value={formData.delivery_radius}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

              <input
                type="number"
                name="delivery_fee"
                placeholder="Delivery Fee"
                value={formData.delivery_fee}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

              <input
                type="number"
                name="minimum_order"
                placeholder="Minimum Order"
                value={formData.minimum_order}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

              <input
                type="number"
                name="estimated_delivery_time"
                placeholder="Delivery Time"
                value={formData.estimated_delivery_time}
                onChange={handleChange}
                className="
                  h-14
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                "
              />

            </div>

          </div>

          {/* OPEN/CLOSE */}

          <div className="
            bg-white/[0.03]
            border
            border-white/10
            rounded-[32px]
            p-8
          ">

            <h2 className="
              text-3xl
              font-black
              mb-8
            ">
              Restaurant Availability
            </h2>

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  Restaurant Open
                </h3>

                <p className="
                  text-gray-400
                  mt-2
                ">
                  Customers can place orders
                </p>

              </div>

              <input
                type="checkbox"
                name="is_open"
                checked={formData.is_open}
                onChange={handleChange}
                className="
                  w-6
                  h-6
                "
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="
              w-full
              h-16
              rounded-2xl
              bg-orange-500
              hover:bg-orange-400
              text-xl
              font-black
              transition
            "
          >

            {
              saving
              ? "Saving..."
              : "Save Settings"
            }

          </button>

        </form>

      </div>

    </RestaurantLayout>
  );
}

export default RestaurantSettings;