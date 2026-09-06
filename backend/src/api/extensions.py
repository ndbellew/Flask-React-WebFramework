from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

cors = CORS()
csrf = CSRFProtect()
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
