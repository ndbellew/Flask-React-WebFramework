from time import time

from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token,  jwt_required, get_jwt_identity, create_refresh_token,
    jwt_required
)
from flask_wtf.csrf import generate_csrf

from api.app import app as api, users, csrf


@api.route('/')
@api.route('/index')
def index():
    return "Hello World"

@api.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify(access_token=access_token)

@api.route('/time')
def get_current_time():
    return {'time': time()}


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email in users and users[email]['password'] == password:
        access_token = create_access_token(identity={'email': email, 'role': users[email]['role']})
        refresh_token = create_refresh_token(identity={'email': email, 'role': users[email]['role']})
        return jsonify(
            access_token=access_token,
            refresh_token=refresh_token,
            role=users[email]['role']
        ), 200

    elif not email or not password:
        return jsonify(
            {'error': 'Please provide both email and password at the same time!'}
        ), 400
    else:
        return jsonify(
            {"error": "Bad email or password"}
        ), 401


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(
        logged_in_as=current_user
    )


@api.route('/get-csrf-token', methods=['GET'])
def get_csrf_token():
    token = generate_csrf()
    return jsonify(
        csrf_token=token
    )

@csrf.exempt
@api.route('/validate-token', methods=['POST'])
@jwt_required()
def validate_token():
    identity = get_jwt_identity()
    return jsonify(
        isValid=True,
        role=identity['role']
    )
