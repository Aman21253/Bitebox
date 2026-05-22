from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from app.middleware.role_middleware import (
    require_role
)

from app.utils.cloudinary import (
    upload_image
)

router = APIRouter(
    prefix="/api/upload",
    tags=["Uploads"]
)


@router.post("/image")
async def upload_image_api(

    image: UploadFile = File(...),

    current_user=Depends(
        require_role([
            "restaurant"
        ])
    )

):

    image_url = upload_image(
        image.file
    )

    return {
        "image_url": image_url
    }