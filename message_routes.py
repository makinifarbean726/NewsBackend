from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from extensions import db
from models import Message

message_bp = Blueprint("messages", __name__, url_prefix="/api/messages")


# =========================
# SEND MESSAGE (TO ADMIN ONLY)
# =========================
@message_bp.route("", methods=["POST"])
@jwt_required()
def send_message():
    claims = get_jwt()
    sender_id = int(claims.get("sub"))

    data = request.get_json()

    if not data.get("content"):
        return jsonify({"error": "content is required"}), 400

    message = Message(
        sender_id=sender_id,
        receiver_id=1,  # ✅ ALWAYS ADMIN
        content=data.get("content")
    )

    db.session.add(message)
    db.session.commit()

    return jsonify({
        "message": "Message sent to admin",
        "data": {
            "id": message.id,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at
        }
    }), 201


# =========================
# GET USER ↔ ADMIN CONVERSATION
# =========================
@message_bp.route("/conversation", methods=["GET"])
@jwt_required()
def get_conversation():
    claims = get_jwt()
    current_user = int(claims.get("sub"))

    messages = Message.query.filter(
        ((Message.sender_id == current_user) & (Message.receiver_id == 1)) |
        ((Message.sender_id == 1) & (Message.receiver_id == current_user))
    ).order_by(Message.created_at.asc()).all()

    return jsonify([
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "created_at": m.created_at
        }
        for m in messages
    ]), 200


# =========================
# ADMIN: GET ALL MESSAGES
# =========================
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
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "created_at": m.created_at
        }
        for m in messages
    ]), 200


# =========================
# ADMIN: DELETE MESSAGE
# =========================
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