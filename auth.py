from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# REGISTER
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User exists"}), 409

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role="admin"
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

#Login
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not check_password_hash(user.password_hash, data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({"access_token": token})


# PROTECTED
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    return jsonify(get_jwt())


# ROLE CHECK
def role_required(role):
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            claims = get_jwt()
            if claims.get("role") != role:
                return jsonify({"error": "Forbidden"}), 403
            return fn(*args, **kwargs)
        decorator.__name__ = fn.__name__
        return decorator
    return wrapper