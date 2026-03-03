import datetime as dt
import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from db.deps import get_db
from models import User, KioskLock
from services.auth.service import (
    user_exists,
    add_user,
    verify_pw,
    sign_token,
    get_hashed,
)
from schemas.auth import Token
from schemas.user import UserCreate
from services.user.get_user import get_current_user

router = APIRouter()
LOCK_ID = 1
LOCK_TTL_SECONDS = int(os.getenv("KIOSK_LOCK_TTL_SECONDS", "300"))

@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if user_exists(payload.username, db):
        raise HTTPException(status_code=400, detail="Username already exists")
    existing_email = db.query(User).filter_by(email=payload.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    add_user(
        payload.username,
        payload.password,
        db,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
    )
    return {"token": sign_token({"sub": payload.username})}


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    hashed = get_hashed(form_data.username, db)
    if not hashed or not verify_pw(form_data.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = db.query(User).filter_by(username=form_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    now = dt.datetime.utcnow()
    expires_at = now + dt.timedelta(seconds=LOCK_TTL_SECONDS)
    lock = (
        db.query(KioskLock)
        .filter_by(id=LOCK_ID)
        .with_for_update()
        .first()
    )
    if lock and lock.is_locked and lock.expires_at and lock.expires_at > now:
        if lock.locked_by_user_id != user.id:
            raise HTTPException(status_code=423, detail="Machine in use")

    if not lock:
        lock = KioskLock(
            id=LOCK_ID,
            is_locked=True,
            locked_by_user_id=user.id,
            expires_at=expires_at,
        )
        db.add(lock)
    else:
        lock.is_locked = True
        lock.locked_by_user_id = user.id
        lock.expires_at = expires_at
    db.commit()
    return {"token": sign_token({"sub": form_data.username})}


@router.post("/logout")
def logout(
    current_user: str = Depends(get_current_user), db: Session = Depends(get_db)
):
    user = db.query(User).filter_by(username=current_user).first()
    if user:
        lock = (
            db.query(KioskLock)
            .filter_by(id=LOCK_ID)
            .with_for_update()
            .first()
        )
        if lock and lock.is_locked and lock.locked_by_user_id == user.id:
            lock.is_locked = False
            lock.locked_by_user_id = None
            lock.expires_at = dt.datetime.utcnow()
            db.commit()
    return {"message": "Logged out successfully"}


@router.get("/kiosk/status")
def kiosk_status(db: Session = Depends(get_db)):
    now = dt.datetime.utcnow()
    lock = db.query(KioskLock).filter_by(id=LOCK_ID).first()
    if lock and lock.is_locked and lock.expires_at and lock.expires_at > now:
        return {"is_locked": True, "expires_at": lock.expires_at.isoformat()}
    if lock and lock.is_locked:
        lock.is_locked = False
        lock.locked_by_user_id = None
        lock.expires_at = now
        db.commit()
    return {"is_locked": False}
