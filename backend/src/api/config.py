import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "development-only-secret-change-me",
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "development-only-jwt-secret-change-me",
    )

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///app.db",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_TIME_LIMIT = timedelta(hours=1)