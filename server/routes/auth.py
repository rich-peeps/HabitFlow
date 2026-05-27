from flask import Blueprint, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from ..models import db, User

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.post("/signup")
def signup():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return {"error": "username, email, and password are required"}, 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return {"error": "Username or email already taken"}, 422

    user = User(username=username, email=email)
    user.password_hash = password
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return {"user": user.to_dict(), "access_token": access_token}, 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {"error": "username and password are required"}, 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.authenticate(password):
        return {"error": "Invalid username or password"}, 401

    access_token = create_access_token(identity=str(user.id))
    return {"user": user.to_dict(), "access_token": access_token}, 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        return {"error": "Invalid token identity"}, 422

    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}, 404

    return user.to_dict(), 200