import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_PATH = os.getenv("DATABASE_PATH", str(BASE_DIR / "portfolio.db"))
APP_HOST = os.getenv("HOST", "0.0.0.0")
APP_PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

NAME_MIN_LENGTH = 2
NAME_MAX_LENGTH = 60
MESSAGE_MIN_LENGTH = 10
MESSAGE_MAX_LENGTH = 2000
