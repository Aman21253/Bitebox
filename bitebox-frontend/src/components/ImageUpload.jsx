import {
  ImagePlus,
  Loader2,
} from "lucide-react";

import {
  useState,
} from "react";

import API from "../api/axios";

function ImageUpload({

  value,

  onChange,

  label = "Upload Image"

}) {

  const [loading, setLoading] =
    useState(false);

  const uploadImage = async (
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await API.post(

          "/upload/image",

          formData,

          {

            headers: {

              "Content-Type":
              "multipart/form-data"

            }

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

      setLoading(false);
    }
  };

  return (

    <div>

      <p className="
        text-sm
        text-gray-400
        mb-3
      ">
        {label}
      </p>

      <label className="
        w-full
        h-56
        rounded-3xl
        border-2
        border-dashed
        border-white/10
        bg-white/[0.03]
        flex
        flex-col
        items-center
        justify-center
        cursor-pointer
        overflow-hidden
        hover:border-orange-500/40
        transition
      ">

        {
          loading ? (

            <Loader2
              className="
                animate-spin
                text-orange-400
              "
              size={42}
            />

          ) : value ? (

            <img
              src={value}
              alt="uploaded"
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <>

              <ImagePlus
                size={44}
                className="
                  text-orange-400
                  mb-4
                "
              />

              <p className="
                font-bold
              ">
                Click to upload
              </p>

            </>

          )
        }

        <input
          type="file"
          className="hidden"
          onChange={uploadImage}
        />

      </label>

    </div>
  );
}

export default ImageUpload;