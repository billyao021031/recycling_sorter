import datetime as dt
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from db.deps import get_db
from services.auth.service import SECRET_KEY, ALGORITHM
from models import User, KioskLock

LOCK_ID = 1

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> str:
    try:
        username: str = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])["sub"]
    except (JWTError, KeyError):
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )
    user = db.query(User).filter_by(username=username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    now = dt.datetime.utcnow()
    lock = db.query(KioskLock).filter_by(id=LOCK_ID).first()
    if not lock or not lock.is_locked or not lock.expires_at or lock.expires_at <= now:
        if lock and lock.is_locked:
            lock.is_locked = False
            lock.locked_by_user_id = None
            lock.expires_at = now
            db.commit()
        raise HTTPException(status_code=423, detail="Session expired")
    if lock.locked_by_user_id != user.id:
        raise HTTPException(status_code=423, detail="Machine in use")
    # Auto-renew lock only on explicit activity requests
    if request.headers.get("X-Activity") == "1":
        lock.expires_at = now + dt.timedelta(seconds=LOCK_TTL_SECONDS)
        db.commit()
    return username
