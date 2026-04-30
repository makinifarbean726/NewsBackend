from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime

from extensions import db
from models import Comment, Article

comment_bp = Blueprint("comments", __name__, url_prefix="/api/comments")


# =========================
# ADD COMMENT (PUBLIC)
# =========================
@comment_bp.route("/", methods=["POST"])
def add_comment():
    data = request.get_json()

    # basic validation
    if not data.get("article_id") or not data.get("message"):
        return jsonify({"error": "article_id and message required"}), 400

    # check article exists
    article = Article.query.get(data.get("article_id"))
    if not article:
        return jsonify({"error": "Article not found"}), 404

    comment = Comment(
        name=data.get("name", "Anonymous"),
        email=data.get("email"),
        message=data.get("message"),
        article_id=data.get("article_id"),
        created_at=datetime.utcnow()
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({
        "message": "Comment added",
        "comment_id": comment.id
    }), 201


# =========================
# GET COMMENTS FOR ARTICLE
# =========================
@comment_bp.route("/article/<int:article_id>", methods=["GET"])
def get_comments(article_id):
    comments = Comment.query.filter_by(article_id=article_id)\
        .order_by(Comment.created_at.desc())\
        .all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "message": c.message,
            "created_at": c.created_at
        }
        for c in comments
    ])


# =========================
# DELETE COMMENT (ADMIN ONLY)
# =========================
@comment_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_comment(id):
    from flask_jwt_extended import get_jwt

    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted"})