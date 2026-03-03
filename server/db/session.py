from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

def _getenv(*keys: str) -> str | None:
    for key in keys:
        value = os.getenv(key)
        if value:
            return value
    return None

def _build_db_url() -> str:
    url = _getenv("MYSQL_URL", "MYSQL_PUBLIC_URL", "DATABASE_URL")
    if url:
        # Ensure SQLAlchemy uses PyMySQL driver
        if url.startswith("mysql://"):
            return url.replace("mysql://", "mysql+pymysql://", 1)
        return url

    user = _getenv("MYSQL_USER", "MYSQLUSER")
    password = _getenv("MYSQL_PASSWORD", "MYSQLPASSWORD")
    host = _getenv("MYSQL_HOST", "MYSQLHOST")
    port = _getenv("MYSQL_PORT", "MYSQLPORT") or "3306"
    database = _getenv("MYSQL_DATABASE", "MYSQLDATABASE")

    missing = [name for name, val in {
        "MYSQL_USER/MYSQLUSER": user,
        "MYSQL_PASSWORD/MYSQLPASSWORD": password,
        "MYSQL_HOST/MYSQLHOST": host,
        "MYSQL_DATABASE/MYSQLDATABASE": database,
    }.items() if not val]
    if missing:
        raise RuntimeError(
            "Missing database environment variables: " + ", ".join(missing)
        )

    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

DB_URL = _build_db_url()

engine = create_engine(DB_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
