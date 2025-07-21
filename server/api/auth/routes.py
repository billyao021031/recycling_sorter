from fastapi import APIRouter, Depends, Form, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from services.auth.core import (
    verify_password, get_password_hash, create_access_token,
    get_user, add_user, user_exists, SECRET_KEY, ALGORITHM
)
from jose import JWTError, jwt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or not user_exists(username):
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/register")
def register(username: str = Form(...), password: str = Form(...)):
    if user_exists(username):
        return JSONResponse(status_code=400, content={"error": "Username already exists"})
    add_user(username, password)
    token = create_access_token({"sub": username})
    return {"message": "User registered successfully", "token": token}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    username = form_data.username
    password = form_data.password
    hashed = get_user(username)
    if not hashed or not verify_password(password, hashed):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": username})
    return {"token": token}

@router.post("/logout")
def logout():
    # For JWT, logout is handled on the frontend by deleting the token
    return {"message": "Logged out successfully"} 