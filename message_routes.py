from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from extensions import db
from models import Message

message_bp = Blueprint("messages", __name__, url_prefix="/api/messages")


# SEND MESSAGE
@message_bp.route("", methods=["POST"])
@jwt_required()
def send_message():
    data = request.get_json() or request.form

    content = data.get("content")
    name = data.get("name")
    email = data.get("email")

    if not content:
        return jsonify({"error": "content is required"}), 400

    message = Message(
        name=name,
        email=email,
        content=content
    )

    db.session.add(message)
    db.session.commit()

    return jsonify({
        "message": "Message sent",
        "data": {
            "id": message.id,
            "name": message.name,
            "email": message.email,
            "content": message.content,
            "created_at": message.created_at
        }
    }), 201


# ADMIN: GET ALL MESSAGES
@message_bp.route("/admin/all", methods=["GET"])
@jwt_required()
def admin_get_all_messages():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    messages = Message.query.order_by(Message.created_at.desc()).all()

    return jsonify([
        {
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "content": m.content,
            "created_at": m.created_at
        }
        for m in messages
    ]), 200


# ADMIN: DELETE MESSAGE
@message_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_message(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    message = Message.query.get(id)

    if not message:
        return jsonify({"error": "Message not found"}), 404

    db.session.delete(message)
    db.session.commit()

    return jsonify({"message": "Message deleted"}), 200