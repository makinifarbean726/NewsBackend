from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from extensions import db
from models import Comment

comment_bp = Blueprint("comments", __name__, url_prefix="/api/comments")


@comment_bp.route("", methods=["POST"])
@jwt_required()
def create_comment():
    data = request.get_json() or request.form

    content = data.get("content")
    article_id = data.get("article_id")

    if not content or not article_id:
        return jsonify({"error": "content and article_id required"}), 400

    comment = Comment(
        content=content,
        article_id=article_id,
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({"message": "Comment added"}), 201


@comment_bp.route("/article/<int:article_id>", methods=["GET"])
@jwt_required()
def get_comments(article_id):
    claims = get_jwt()

    comments = Comment.query.filter_by(article_id=article_id).order_by(Comment.created_at.desc()).all()

    return jsonify([
        {
            "id": c.id,
            "content": c.content,
            "created_at": c.created_at
        }
        for c in comments
    ])

@comment_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_comment(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted"})