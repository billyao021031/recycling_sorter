import datetime as dt
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from db import Base


class KioskLock(Base):
    __tablename__ = "kiosk_lock"

    id = Column(Integer, primary_key=True)  # single-row lock (id=1)
    is_locked = Column(Boolean, default=False, nullable=False)
    locked_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    expires_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)
