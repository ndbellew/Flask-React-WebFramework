from typing import Dict

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from ..extensions import db
from ..models import User, RevokedToken

from ..decorators.require_json import require_json


user_bp = Blueprint("user", __name__)

@user_bp.route("/me")
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.execute(db.select(User).where(User.id == user_id)).scalar_one_or_none()
    return jsonify(user)

@user_bp.route("/profile/<str:username>")
@require_json("username", "user_id")
def get_profile(data: dict):
    username = data.get("username")
    user_id = int(data.get("user_id"))
    user = db.session.execute(
        db.select(User).where(User.id == user_id)
    )
    return jsonify(message=f"Profile for user {username}")

@user_bp.route("/register")
def register():
    return jsonify(message="Registration successful")

@user_bp.post("/logout")
@require_json( "user_id", "jti")
@jwt_required()
def logout(data: Dict[str, str]):
    user_id: int = int(data.get("user_id"))
    jti: str = data.get("jti")

    revoked_token = RevokedToken(jti=jti)
    db.session.add(revoked_token)
    db.session.commit()

    return jsonify(message="Logged out")

@user_bp.post("/login")
@require_json("email", "password")
def login(data: Dict[str, str]):

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

@user_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token)


