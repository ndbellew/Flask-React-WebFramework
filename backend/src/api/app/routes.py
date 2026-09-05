from time import time

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from flask_wtf.csrf import generate_csrf

from api.extensions import csrf, db
from api.models import User

api_bp = Blueprint("api", __name__)


@api_bp.route('/')
@api_bp.route('/index')
def index():
    return "Hello World"

@api_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token)

@api_bp.route('/time')
def get_current_time():
    return {'time': time()}


@api_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify(
            error="Email and password are required",
        ), 400

    user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None or not user.check_password(password):
        return jsonify(
            error="Invalid email or password",
        ), 401

    claims = {"role": user.role}

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims=claims,
    )
    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims=claims,
    )

    return jsonify(
        access_token=access_token,
        refresh_token=refresh_token,
        role=user.role,
    ), 200


@api_bp.get('/protected')
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(
        logged_in_as=current_user
    )


@api_bp.get('/get-csrf-token')
def get_csrf_token():
    token = generate_csrf()
    return jsonify(
        csrf_token=token
    )

@csrf.exempt
@api_bp.post('/validate-token')
@jwt_required()
def validate_token():
    identity = get_jwt_identity()
    return jsonify(
        isValid=True,
        role=identity['role']
    )
