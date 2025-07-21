from fastapi import APIRouter, Form, UploadFile, File
from services.model.image_upload import save_uploaded_image
# from fastapi import Depends, HTTPException
# from fastapi.security import OAuth2PasswordBearer
# from services.auth.core import SECRET_KEY, ALGORITHM, user_exists
# from jose import jwt, JWTError

router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None or not user_exists(username):
#             raise HTTPException(status_code=401, detail="Invalid authentication credentials")
#         return username
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/upload-image")
# Authentication is bypassed for now. To re-enable, uncomment the lines above and add user: str = Depends(get_current_user)
def upload_image(image: UploadFile = File(...)):
    file_bytes = image.file.read()
    filepath = save_uploaded_image(file_bytes, image.filename)
    return {"message": "Image uploaded and saved successfully", "filepath": filepath} 