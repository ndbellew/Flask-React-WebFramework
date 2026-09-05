import pytest

from api.app import create_app
from api.extensions import db
from api.models import User


class TestConfig:
    TESTING = True

    SECRET_KEY = "test-secret-key-at-least-32-bytes"
    JWT_SECRET_KEY = "test-jwt-secret-at-least-32-bytes"

    SQLALCHEMY_DATABASE_URI = "sqlite://"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # API tests shouldn't need to negotiate browser CSRF tokens.
    WTF_CSRF_ENABLED = False


@pytest.fixture()
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()

        yield app

        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def user(app):
    user = User(
        email="test@example.com",
        role="user",
    )
    user.set_password("correct-password")

    db.session.add(user)
    db.session.commit()

    return user


@pytest.fixture()
def login(client, user):
    response = client.post(
        "/login",
        json={
            "email": user.email,
            "password": "correct-password",
        },
    )

    return response.get_json()


@pytest.fixture()
def auth_headers(login):
    return {
        "Authorization": f"Bearer {login['access_token']}",
    }