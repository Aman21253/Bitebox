import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

import RestaurantLayout from "../../layouts/RestaurantLayout";

import CreateCategoryForm from "../../components/restaurant/CreateCategoryForm";

import CreateMenuItemForm from "../../components/restaurant/CreateMenuItemForm";

import MenuItemCard from "../../components/restaurant/MenuItemCard";

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

      setItems(
        itemResponse.data
      );

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

      if (!categoryData.name) {

        alert(
          "Category name required"
        );

        return;
      }

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
        "Category created successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Failed to create category"
      );
    }
  };

  // CREATE ITEM

  const createItem = async (
    e
  ) => {

    e.preventDefault();

    try {

      if (
        !itemData.category_id ||
        !itemData.name ||
        !itemData.base_price
      ) {

        alert(
          "Please fill required fields"
        );

        return;
      }

      await API.post(
        "/menu/items",
        {
          ...itemData,
          category_id: Number(
            itemData.category_id
          ),
          base_price: Number(
            itemData.base_price
          ),
          preparation_time: Number(
            itemData.preparation_time
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
        "Menu item created successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Failed to create menu item"
      );
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

      <RestaurantLayout>

        <div className="
          h-screen
          flex
          items-center
          justify-center
        ">

          <div className="
            text-3xl
            font-black
          ">
            Loading Menu...
          </div>

        </div>

      </RestaurantLayout>
    );
  }

  return (

    <RestaurantLayout>

      <div className="
        max-w-[1700px]
        mx-auto
        px-8
        py-8
      ">

        {/* HEADER */}

        <div className="
          mb-12
        ">

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

        {/* FORMS */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
          mb-14
        ">

          <CreateCategoryForm
            categoryData={categoryData}
            setCategoryData={setCategoryData}
            createCategory={createCategory}
          />

          <CreateMenuItemForm
            categories={categories}
            itemData={itemData}
            setItemData={setItemData}
            createItem={createItem}
          />

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

                <h2 className="
                  text-3xl
                  font-black
                  mb-4
                ">
                  No Menu Items Yet
                </h2>

                <p className="
                  text-gray-400
                ">
                  Start building your restaurant menu.
                </p>

              </div>

            ) : (

              items.map((item) => (

                <MenuItemCard
                  key={item.id}
                  item={item}
                  toggleAvailability={
                    toggleAvailability
                  }
                />

              ))
            )
          }

        </div>

      </div>

    </RestaurantLayout>
  );
}

export default RestaurantMenu;