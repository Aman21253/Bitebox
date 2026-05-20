function CreateMenuItemForm({
  categories,
  itemData,
  setItemData,
  createItem,
}) {

  return (

    <div className="
      bg-white/[0.03]
      border
      border-white/10
      rounded-[36px]
      p-8
    ">

      <h2 className="
        text-3xl
        font-black
        mb-8
      ">
        Create Menu Item
      </h2>

      <form
        onSubmit={createItem}
        className="space-y-5"
      >

        <select
          value={itemData.category_id}
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
          "
        />

        <textarea
          placeholder="Description"
          value={itemData.description}
          onChange={(e) =>
            setItemData({
              ...itemData,
              description:
                e.target.value,
            })
          }
          className="
            w-full
            h-32
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/10
            p-5
            resize-none
          "
        />

        <input
          type="text"
          placeholder="Image URL"
          value={itemData.image_url}
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
            value={itemData.base_price}
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
            "
          />

          <input
            type="number"
            placeholder="Prep Time"
            value={itemData.preparation_time}
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
            "
          />

        </div>

        <button className="
          w-full
          h-16
          rounded-2xl
          bg-orange-500
          hover:bg-orange-400
          font-bold
        ">
          Create Item
        </button>

      </form>

    </div>
  );
}

export default CreateMenuItemForm;