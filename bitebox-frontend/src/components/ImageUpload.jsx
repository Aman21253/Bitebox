import { useState } from "react";

import API from "../api/axios";

function ImageUpload({

  value,
  onChange,
  label

}) {

  const [uploading, setUploading] =
    useState(false);

  const handleUpload = async (
    e
  ) => {

    try {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      setUploading(true);

      const response =
        await API.post(

          "/upload/image",

          formData,

          {
            headers: {
              "Content-Type":
              "multipart/form-data",
            },
          }
        );

      onChange(
        response.data.image_url
      );

    } catch (error) {

      console.log(error);

      alert(
        "Image upload failed"
      );

    } finally {

      setUploading(false);
    }
  };

  return (

    <div>

      <p className="
        mb-4
        font-bold
        text-lg
      ">
        {label}
      </p>

      <label className="
        h-[260px]
        rounded-[32px]
        border-2
        border-dashed
        border-white/10
        bg-white/[0.03]
        flex
        flex-col
        items-center
        justify-center
        overflow-hidden
        cursor-pointer
        relative
      ">

        {
          value ? (

            <img
              src={value}
              alt="upload"
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <div className="
              text-center
            ">

              <p className="
                text-xl
                font-bold
                mb-2
              ">
                Upload Image
              </p>

              <p className="
                text-gray-400
              ">
                JPG, PNG, WEBP
              </p>

            </div>
          )
        }

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        {
          uploading && (

            <div className="
              absolute
              inset-0
              bg-black/70
              flex
              items-center
              justify-center
              text-xl
              font-black
            ">
              Uploading...
            </div>
          )
        }

      </label>

    </div>
  );
}

export default ImageUpload;