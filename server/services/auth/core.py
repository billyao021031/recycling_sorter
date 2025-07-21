from jose import JWTError, jwt
from passlib.context import CryptContext

users_db = {}
SECRET_KEY = "secret-key-demo"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def get_user(username: str):
    return users_db.get(username)

def add_user(username: str, password: str):
    users_db[username] = get_password_hash(password)

def user_exists(username: str):
    return username in users_db 