from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

import cloudinary.uploader

from app.config.cloudinary_config import *

router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"]
)


# ─────────────────────────────────────────────
# UPLOAD IMAGE
# ─────────────────────────────────────────────

@router.post("/image")
async def upload_image(

    file: UploadFile = File(...)

):

    try:

        # UPLOAD TO CLOUDINARY

        result = cloudinary.uploader.upload(

            file.file,

            folder="bitebox"

        )

        return {

            "message":
            "Image uploaded successfully",

            "image_url":
            result["secure_url"]

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )