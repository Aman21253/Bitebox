import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import {
  Plus,
  UtensilsCrossed,
  Vegan,
  Drumstick,
  Clock3,
} from "lucide-react";

function RestaurantMenu() {

  const [categories, setCategories] =
    useState([]);

  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // CATEGORY FORM

  const [categoryData, setCategoryData] =
    useState({
      name: "",
      description: "",
    });

  // ITEM FORM

  const [itemData, setItemData] =
    useState({
      category_id: "",
      name: "",
      description: "",
      image_url: "",
      is_veg: true,
      base_price: "",
      preparation_time: 15,
    });

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const categoryResponse =
        await API.get(
          "/menu/categories"
        );

      const itemResponse =
        await API.get(
          "/menu/items"
        );

      setCategories(
        categoryResponse.data
      );

      setItems(itemResponse.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // CREATE CATEGORY

  const createCategory = async (
    e
  ) => {

    e.preventDefault();

    try {

      await API.post(
        "/menu/categories",
        categoryData
      );

      setCategoryData({
        name: "",
        description: "",
      });

      fetchData();

      alert(
        "Category created"
      );

    } catch (error) {

      console.log(error);

    }
  };

  // CREATE ITEM

  const createItem = async (
    e
  ) => {

    e.preventDefault();

    try {

      await API.post(
        "/menu/items",
        {
          ...itemData,
          base_price: Number(
            itemData.base_price
          ),
          category_id: Number(
            itemData.category_id
          ),
        }
      );

      setItemData({
        category_id: "",
        name: "",
        description: "",
        image_url: "",
        is_veg: true,
        base_price: "",
        preparation_time: 15,
      });

      fetchData();

      alert(
        "Menu item created"
      );

    } catch (error) {

      console.log(error);

    }
  };

  // TOGGLE AVAILABILITY

  const toggleAvailability =
    async (id) => {

      try {

        await API.put(
          `/menu/items/${id}/availability`
        );

        fetchData();

      } catch (error) {

        console.log(error);

      }
    };

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-[#0b1120]
        text-white
        flex
        items-center
        justify-center
      ">

        <div className="
          text-center
        ">

          <div className="
            w-16
            h-16
            rounded-full
            border-4
            border-orange-500/20
            border-t-orange-500
            animate-spin
            mx-auto
            mb-6
          " />

          <h2 className="
            text-3xl
            font-black
          ">
            Loading Menu...
          </h2>

        </div>

      </div>
    );
  }

  return (

    <div className="
      min-h-screen
      bg-[#0b1120]
      text-white
    ">

      <div className="
        max-w-[1700px]
        mx-auto
        px-8
        py-8
      ">

        {/* HEADER */}

        <div className="
          flex
          items-center
          justify-between
          mb-12
        ">

          <div>

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-4
            ">
              Restaurant Panel
            </p>

            <h1 className="
              text-6xl
              font-black
              tracking-tight
              leading-none
            ">
              Menu Management
            </h1>

          </div>

        </div>

        {/* FORMS */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
          mb-14
        ">

          {/* CATEGORY FORM */}

          <div className="
            bg-white/[0.03]
            border
            border-white/10
            rounded-[36px]
            p-8
            backdrop-blur-2xl
          ">

            <div className="
              flex
              items-center
              gap-4
              mb-8
            ">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-orange-500/10
                flex
                items-center
                justify-center
              ">

                <Plus
                  className="
                    text-orange-400
                  "
                />

              </div>

              <div>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  Create Category
                </h2>

                <p className="
                  text-gray-400
                  mt-1
                ">
                  Organize your menu beautifully
                </p>

              </div>

            </div>

            <form
              onSubmit={createCategory}
              className="
                space-y-5
              "
            >

              <input
                type="text"
                placeholder="Category Name"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    name: e.target.value,
                  })
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                  text-[15px]
                  outline-none
                  focus:border-orange-500/50
                  focus:bg-white/[0.07]
                  transition-all
                  duration-300
                "
              />

              <textarea
                placeholder="Description"
                value={
                  categoryData.description
                }
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    description:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  p-5
                  text-[15px]
                  outline-none
                  h-36
                  resize-none
                  focus:border-orange-500/50
                  focus:bg-white/[0.07]
                  transition-all
                  duration-300
                "
              />

              <button className="
                w-full
                h-16
                rounded-2xl
                bg-orange-500
                hover:bg-orange-400
                font-bold
                text-lg
                transition-all
                duration-300
                hover:scale-[1.01]
                shadow-lg
                shadow-orange-500/20
              ">
                Create Category
              </button>

            </form>

          </div>

          {/* ITEM FORM */}

          <div className="
            bg-white/[0.03]
            border
            border-white/10
            rounded-[36px]
            p-8
            backdrop-blur-2xl
          ">

            <div className="
              flex
              items-center
              gap-4
              mb-8
            ">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-orange-500/10
                flex
                items-center
                justify-center
              ">

                <UtensilsCrossed
                  className="
                    text-orange-400
                  "
                />

              </div>

              <div>

                <h2 className="
                  text-3xl
                  font-black
                ">
                  Add Menu Item
                </h2>

                <p className="
                  text-gray-400
                  mt-1
                ">
                  Create premium dishes
                </p>

              </div>

            </div>

            <form
              onSubmit={createItem}
              className="
                space-y-5
              "
            >

              <select
                value={
                  itemData.category_id
                }
                onChange={(e) =>
                  setItemData({
                    ...itemData,
                    category_id:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                  text-[15px]
                  outline-none
                  focus:border-orange-500/50
                  transition-all
                  duration-300
                "
              >

                <option value="">
                  Select Category
                </option>

                {
                  categories.map(
                    (category) => (

                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )
                }

              </select>

              <input
                type="text"
                placeholder="Item Name"
                value={itemData.name}
                onChange={(e) =>
                  setItemData({
                    ...itemData,
                    name: e.target.value,
                  })
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                  text-[15px]
                  outline-none
                  focus:border-orange-500/50
                  transition-all
                  duration-300
                "
              />

              <textarea
                placeholder="Description"
                value={
                  itemData.description
                }
                onChange={(e) =>
                  setItemData({
                    ...itemData,
                    description:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  p-5
                  h-32
                  resize-none
                  text-[15px]
                  outline-none
                  focus:border-orange-500/50
                  transition-all
                  duration-300
                "
              />

              <input
                type="text"
                placeholder="Image URL"
                value={
                  itemData.image_url
                }
                onChange={(e) =>
                  setItemData({
                    ...itemData,
                    image_url:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  h-16
                  rounded-2xl
                  bg-white/[0.04]
                  border
                  border-white/10
                  px-5
                  text-[15px]
                  outline-none
                  focus:border-orange-500/50
                  transition-all
                  duration-300
                "
              />

              <div className="
                grid
                grid-cols-2
                gap-4
              ">

                <input
                  type="number"
                  placeholder="Price"
                  value={
                    itemData.base_price
                  }
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      base_price:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-5
                    text-[15px]
                    outline-none
                    focus:border-orange-500/50
                    transition-all
                    duration-300
                  "
                />

                <input
                  type="number"
                  placeholder="Prep Time"
                  value={
                    itemData.preparation_time
                  }
                  onChange={(e) =>
                    setItemData({
                      ...itemData,
                      preparation_time:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-5
                    text-[15px]
                    outline-none
                    focus:border-orange-500/50
                    transition-all
                    duration-300
                  "
                />

              </div>

              {/* VEG/NON VEG */}

              <div className="
                flex
                gap-4
              ">

                <button
                  type="button"
                  onClick={() =>
                    setItemData({
                      ...itemData,
                      is_veg: true,
                    })
                  }
                  className={`
                    flex-1
                    h-16
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    gap-3
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      itemData.is_veg
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : "border-white/10 hover:bg-white/[0.03]"
                    }
                  `}
                >

                  <Vegan size={18} />

                  Veg

                </button>

                <button
                  type="button"
                  onClick={() =>
                    setItemData({
                      ...itemData,
                      is_veg: false,
                    })
                  }
                  className={`
                    flex-1
                    h-16
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    gap-3
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      !itemData.is_veg
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "border-white/10 hover:bg-white/[0.03]"
                    }
                  `}
                >

                  <Drumstick size={18} />

                  Non Veg

                </button>

              </div>

              <button className="
                w-full
                h-16
                rounded-2xl
                bg-orange-500
                hover:bg-orange-400
                font-bold
                text-lg
                transition-all
                duration-300
                hover:scale-[1.01]
                shadow-lg
                shadow-orange-500/20
              ">
                Create Item
              </button>

            </form>

          </div>

        </div>

        {/* MENU HEADER */}

        <div className="
          flex
          items-center
          justify-between
          mb-8
        ">

          <div>

            <p className="
              text-orange-400
              uppercase
              tracking-[3px]
              text-xs
              font-bold
              mb-3
            ">
              Your Menu
            </p>

            <h2 className="
              text-4xl
              font-black
            ">
              Menu Items
            </h2>

          </div>

          <div className="
            px-5
            py-3
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/10
            text-gray-300
            font-semibold
          ">
            {items.length} Total Items
          </div>

        </div>

        {/* ITEMS */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        ">

          {
            items.length === 0 ? (

              <div className="
                col-span-full
                rounded-[36px]
                border
                border-dashed
                border-white/10
                bg-white/[0.02]
                p-16
                text-center
              ">

                <div className="
                  w-24
                  h-24
                  rounded-full
                  bg-orange-500/10
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-6
                ">

                  <UtensilsCrossed
                    size={42}
                    className="text-orange-400"
                  />

                </div>

                <h2 className="
                  text-3xl
                  font-black
                  mb-4
                ">
                  No Menu Items Yet
                </h2>

                <p className="
                  text-gray-400
                  max-w-[500px]
                  mx-auto
                  leading-relaxed
                ">
                  Start building your restaurant menu
                  by creating your first delicious item.
                </p>

              </div>

            ) : (

              items.map((item) => (

                <div
                  key={item.id}
                  className="
                    bg-white/[0.03]
                    border
                    border-white/10
                    rounded-[36px]
                    overflow-hidden
                    group
                    hover:-translate-y-2
                    hover:border-orange-500/30
                    transition-all
                    duration-500
                  "
                >

                  <div className="
                    overflow-hidden
                  ">

                    <img
                      src={
                        item.image_url ||
                        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={item.name}
                      className="
                        w-full
                        h-[260px]
                        object-cover
                        group-hover:scale-110
                        transition-transform
                        duration-700
                      "
                    />

                  </div>

                  <div className="p-7">

                    <div className="
                      flex
                      items-start
                      justify-between
                      mb-5
                    ">

                      <div>

                        <h2 className="
                          text-3xl
                          font-black
                          leading-tight
                        ">
                          {item.name}
                        </h2>

                        <p className="
                          text-gray-400
                          mt-3
                          leading-relaxed
                        ">
                          {item.description}
                        </p>

                      </div>

                      <div className={`
                        w-4
                        h-4
                        rounded-full
                        mt-2
                        ${
                          item.is_veg
                          ? "bg-green-500"
                          : "bg-red-500"
                        }
                      `} />

                    </div>

                    <div className="
                      flex
                      items-center
                      justify-between
                      mb-6
                    ">

                      <p className="
                        text-4xl
                        font-black
                        text-orange-400
                      ">
                        ₹{item.base_price}
                      </p>

                      <div className="
                        flex
                        items-center
                        gap-2
                        text-gray-400
                      ">

                        <Clock3 size={16} />

                        {item.preparation_time}m

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        toggleAvailability(
                          item.id
                        )
                      }
                      className={`
                        w-full
                        h-14
                        rounded-2xl
                        font-bold
                        transition-all
                        duration-300
                        ${
                          item.is_available
                          ? "bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30"
                        }
                      `}
                    >

                      {
                        item.is_available
                        ? "Available"
                        : "Unavailable"
                      }

                    </button>

                  </div>

                </div>
              ))
            )
          }

        </div>

      </div>

    </div>
  );
}

export default RestaurantMenu;