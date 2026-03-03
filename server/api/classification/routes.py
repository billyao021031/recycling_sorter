import datetime as dt
import os
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, Header
from sqlalchemy.orm import Session
from db.deps import get_db
from models import ClassificationLog, User, KioskLock
from services.classification.image_upload import save_uploaded_image
from services.classification.inference import (
    preprocess_image,
    run_inference_model,
)
from schemas.classification import PredictionResponse, HistoryItem
from services.user.get_user import get_current_user

router = APIRouter()
LOCK_ID = 1
MACHINE_TOKEN = os.getenv("MACHINE_TOKEN")

def _get_active_lock_user_id(db: Session, renew: bool = False) -> int | None:
    now = dt.datetime.utcnow()
    lock = db.query(KioskLock).filter_by(id=LOCK_ID).first()
    if lock and lock.is_locked and lock.expires_at and lock.expires_at > now:
        if renew:
            lock.expires_at = now + dt.timedelta(seconds=int(os.getenv("KIOSK_LOCK_TTL_SECONDS", "300")))
            db.commit()
        return lock.locked_by_user_id
    if lock and lock.is_locked:
        lock.is_locked = False
        lock.locked_by_user_id = None
        lock.expires_at = now
        db.commit()
    return None

def _require_machine_token(x_machine_token: str | None) -> None:
    if not MACHINE_TOKEN or not x_machine_token or x_machine_token != MACHINE_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid machine token")

def to_dict(row: ClassificationLog) -> dict:
    return {
        "predicted_class": row.predicted_class,
        "confidence": f"{row.confidence*100:.2f}%",
        "raw_output": row.raw_output,
        "image_url": row.image_url,
        "rebate": row.rebate
    }

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    image: UploadFile = File(...),
    weight: float = Form(...),
    x_machine_token: str | None = Header(default=None, alias="X-Machine-Token"),
    db: Session = Depends(get_db)
):
    _require_machine_token(x_machine_token)
    user_id = _get_active_lock_user_id(db, renew=True)
    if not user_id:
        raise HTTPException(status_code=423, detail="No active user")
    weight = weight * 0.054
    img_bytes = await image.read()
    tensor = preprocess_image(img_bytes)
    res = run_inference_model(tensor, weight_grams=weight)

    url = save_uploaded_image(img_bytes, image.filename)
    rebate = 0.1

    row = ClassificationLog(
        user_id=user_id,
        predicted_class=res["predicted_class"],
        confidence=res["confidence"],
        raw_output=res["raw_output"],
        image_url=url,
        rebate=rebate,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return to_dict(row)


@router.get("/latest", response_model=list[PredictionResponse])
def latest(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter_by(username=current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    rows = (
        db.query(ClassificationLog)
          .filter(ClassificationLog.user_id == user.id)
          .order_by(ClassificationLog.created_at.desc())
          .limit(3)
          .all()
    )
    return [to_dict(r) for r in rows]

@router.get("/history", response_model=list[HistoryItem])
def history(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter_by(username=current_user).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    rows = (
        db.query(ClassificationLog)
          .filter(ClassificationLog.user_id == user.id)
          .order_by(ClassificationLog.created_at.desc())
          .all()
    )
    return [
        {
            "id": r.id,
            "category": r.predicted_class,
            "date": r.created_at.strftime("%Y-%m-%d"),
            "rebate": round(r.rebate, 2),
            "image_url": r.image_url,
        }
        for r in rows
    ]
