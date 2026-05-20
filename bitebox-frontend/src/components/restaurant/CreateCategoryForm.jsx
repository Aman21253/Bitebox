function CreateCategoryForm({
  categoryData,
  setCategoryData,
  createCategory,
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
        Create Category
      </h2>

      <form
        onSubmit={createCategory}
        className="space-y-5"
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
            outline-none
          "
        />

        <textarea
          placeholder="Description"
          value={categoryData.description}
          onChange={(e) =>
            setCategoryData({
              ...categoryData,
              description:
                e.target.value,
            })
          }
          className="
            w-full
            h-36
            rounded-2xl
            bg-white/[0.04]
            border
            border-white/10
            p-5
            resize-none
            outline-none
          "
        />

        <button className="
          w-full
          h-16
          rounded-2xl
          bg-orange-500
          hover:bg-orange-400
          font-bold
        ">
          Create Category
        </button>

      </form>

    </div>
  );
}

export default CreateCategoryForm;