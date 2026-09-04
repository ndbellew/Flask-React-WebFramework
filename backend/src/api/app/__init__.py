from flask import Flask
from flask_jwt_extended import JWTManager
from flask_wtf.csrf import CSRFProtect

from api.config import Config

app = Flask(__name__)
app.config.from_object(Config)
csrf = CSRFProtect(app)
jwt = JWTManager(app)

users = {
    'test@user.com': {
        'password': 'testpassword',
        'role': 'user'
    },
    'admin@admin.com': {
        'password': '<PASSWORD>',
        'role': 'admin'
    }
}

from api.app import routes