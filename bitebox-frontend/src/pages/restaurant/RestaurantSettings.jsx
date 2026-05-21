import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import RestaurantSidebar from "../../components/restaurant/RestaurantSidebar";

import ImageUpload from "../../components/ImageUpload";

function RestaurantSettings() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // BASIC INFO

  const [name, setName] =
    useState("");

  const [cuisine, setCuisine] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [description, setDescription] =
    useState("");

  // IMAGES

  const [logo, setLogo] =
    useState("");

  const [banner, setBanner] =
    useState("");

  // DELIVERY

  const [deliveryFee, setDeliveryFee] =
    useState("");

  const [deliveryTime, setDeliveryTime] =
    useState("");

  const [minimumOrder, setMinimumOrder] =
    useState("");

  const [maximumRadius, setMaximumRadius] =
    useState("");

  // STATUS

  const [isOpen, setIsOpen] =
    useState(true);

  // FETCH SETTINGS

  useEffect(() => {

    fetchSettings();

  }, []);

  const fetchSettings = async () => {

    try {

      const response = await API.get(
        "/restaurant/settings"
      );

      const data = response.data;

      // BASIC

      setName(
        data.name || ""
      );

      setCuisine(
        data.cuisine || ""
      );

      setPhone(
        data.phone || ""
      );

      setDescription(
        data.description || ""
      );

      // IMAGES

      setLogo(
        data.logo || ""
      );

      setBanner(
        data.banner || ""
      );

      // DELIVERY

      setDeliveryFee(
        data.delivery_fee || ""
      );

      setDeliveryTime(
        data.delivery_time || ""
      );

      setMinimumOrder(
        data.minimum_order || ""
      );

      setMaximumRadius(
        data.maximum_radius || ""
      );

      // STATUS

      setIsOpen(
        data.is_open
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // SAVE SETTINGS

  const saveSettings = async () => {

    try {

      setSaving(true);

      await API.put(
        "/restaurant/settings",
        {

          name,
          cuisine,
          phone,
          description,

          logo,
          banner,

          delivery_fee:
          deliveryFee,

          delivery_time:
          deliveryTime,

          minimum_order:
          minimumOrder,

          maximum_radius:
          maximumRadius,

          is_open:
          isOpen

        }
      );

      alert(
        "✅ Settings Updated"
      );

    } catch (error) {

      console.log(error);

      alert(
        "❌ Failed to update settings"
      );

    } finally {

      setSaving(false);
    }
  };

  // LOADING

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-[#070b14]
        flex
        items-center
        justify-center
        text-white
        text-4xl
        font-black
      ">
        Loading Settings...
      </div>
    );
  }

  return (

    <div className="
      min-h-screen
      bg-[#070b14]
      text-white
      flex
    ">

      {/* SIDEBAR */}

      <RestaurantSidebar />

      {/* MAIN */}

      <div className="
        flex-1
        p-8
        overflow-y-auto
      ">

        {/* HEADER */}

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

        {/* BASIC INFO */}

        <div className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          p-8
          mb-8
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
            mb-6
          ">

            <input
              type="text"
              placeholder="Restaurant Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

            <input
              type="text"
              placeholder="Cuisine"
              value={cuisine}
              onChange={(e) =>
                setCuisine(e.target.value)
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

          </div>

          {/* DESCRIPTION */}

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={5}
            className="
              w-full
              rounded-3xl
              bg-white/[0.03]
              border
              border-white/10
              p-5
              outline-none
              resize-none
              mb-8
            "
          />

          {/* IMAGE UPLOADS */}

          <div className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-8
          ">

            <ImageUpload
              value={logo}
              onChange={setLogo}
              label="Restaurant Logo"
            />

            <ImageUpload
              value={banner}
              onChange={setBanner}
              label="Restaurant Banner"
            />

          </div>

        </div>

        {/* DELIVERY SETTINGS */}

        <div className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          p-8
          mb-8
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
              placeholder="Delivery Fee"
              value={deliveryFee}
              onChange={(e) =>
                setDeliveryFee(
                  e.target.value
                )
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

            <input
              type="number"
              placeholder="Delivery Time"
              value={deliveryTime}
              onChange={(e) =>
                setDeliveryTime(
                  e.target.value
                )
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

            <input
              type="number"
              placeholder="Minimum Order"
              value={minimumOrder}
              onChange={(e) =>
                setMinimumOrder(
                  e.target.value
                )
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

            <input
              type="number"
              placeholder="Maximum Radius"
              value={maximumRadius}
              onChange={(e) =>
                setMaximumRadius(
                  e.target.value
                )
              }
              className="
                h-16
                rounded-2xl
                bg-white/[0.03]
                border
                border-white/10
                px-5
                outline-none
              "
            />

          </div>

        </div>

        {/* AVAILABILITY */}

        <div className="
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.03]
          p-8
          mb-8
        ">

          <h2 className="
            text-3xl
            font-black
            mb-6
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
                mb-2
              ">
                Restaurant Open
              </h3>

              <p className="
                text-gray-400
              ">
                Customers can place orders
              </p>

            </div>

            <input
              type="checkbox"
              checked={isOpen}
              onChange={(e) =>
                setIsOpen(
                  e.target.checked
                )
              }
              className="
                w-7
                h-7
                accent-orange-500
              "
            />

          </div>

        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={saveSettings}
          disabled={saving}
          className="
            w-full
            h-16
            rounded-2xl
            bg-orange-500
            hover:bg-orange-600
            transition
            font-black
            text-xl
            disabled:opacity-50
          "
        >

          {
            saving
              ? "Saving..."
              : "Save Settings"
          }

        </button>

      </div>

    </div>
  );
}

export default RestaurantSettings;