from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime

from extensions import db
from models import Comment, Article

comment_bp = Blueprint("comments", __name__, url_prefix="/api/comments")


# =========================
# ADD COMMENT (PUBLIC)
# =========================
# CREATE COMMENT
@comment_bp.route("", methods=["POST"])
@jwt_required()
def create_comment():
    user_id = get_jwt()["sub"]
    data = request.get_json()

    comment = Comment(
        content=data["content"],
        user_id=user_id,
        article_id=data["article_id"]
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({"message": "Comment added"}), 201


# GET COMMENTS FOR ARTICLE
@comment_bp.route("/article/<int:article_id>", methods=["GET"])
def get_comments(article_id):
    comments = Comment.query.filter_by(article_id=article_id).all()

    return jsonify([
        {
            "id": c.id,
            "content": c.content,
            "created_at": c.created_at
        }
        for c in comments
    ])