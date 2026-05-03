from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from werkzeug.utils import secure_filename
import os
import uuid

from extensions import db
from models import Media, Article

media_bp = Blueprint("media", __name__, url_prefix="/api/media")

UPLOAD_FOLDER = "static/uploads"

ALLOWED_EXTENSIONS = {
    "png", "jpg", "jpeg", "gif",
    "mp4", "mp3", "wav",
    "pdf", "doc", "docx"
}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# =========================
# UPLOAD MEDIA (ONE OR MANY)
# =========================
@media_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_media():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    files = request.files.getlist("files") or request.files.getlist("file")

    if not files:
        return jsonify({"error": "No files provided"}), 400

    article_id = request.form.get("article_id")

    article = None
    if article_id:
        article = Article.query.get(article_id)
        if not article:
            return jsonify({"error": "Article not found"}), 404

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    uploaded_files = []

    for file in files:
        if file.filename == "":
            continue

        if not allowed_file(file.filename):
            continue

        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_name)

        file.save(filepath)

        media = Media(
            article_id=article.id if article else None,
            file_url=f"/static/uploads/{unique_name}",
            file_type=filename.rsplit(".", 1)[1].lower(),
            title=filename
        )

        db.session.add(media)
        uploaded_files.append({
            "id": media.id,
            "file_url": media.file_url,
            "file_type": media.file_type
        })

    db.session.commit()

    return jsonify({
        "message": "Media uploaded",
        "files": uploaded_files
    }), 201


# =========================
# ADD MEDIA TO EXISTING ARTICLE
# =========================
@media_bp.route("/attach/<int:article_id>", methods=["POST"])
@jwt_required()
def attach_media(article_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    article = Article.query.get(article_id)

    if not article:
        return jsonify({"error": "Article not found"}), 404

    files = request.files.getlist("files")

    if not files:
        return jsonify({"error": "No files provided"}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    for file in files:
        if file.filename == "" or not allowed_file(file.filename):
            continue

        filename = secure_filename(file.filename)
        unique_name = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_name)

        file.save(filepath)

        media = Media(
            article_id=article.id,
            file_url=f"/static/uploads/{unique_name}",
            file_type=filename.rsplit(".", 1)[1].lower(),
            title=filename
        )

        db.session.add(media)

    db.session.commit()

    return jsonify({"message": "Media attached to article"})


# =========================
# GET MEDIA BY ARTICLE
# =========================
@media_bp.route("/article/<int:article_id>", methods=["GET"])
def get_media_by_article(article_id):
    media_files = Media.query.filter_by(article_id=article_id).all()

    return jsonify([
        {
            "id": m.id,
            "file_url": m.file_url,
            "file_type": m.file_type,
            "title": m.title
        }
        for m in media_files
    ])


# =========================
# DELETE SINGLE MEDIA
# =========================
@media_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_media(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    media = Media.query.get(id)

    if not media:
        return jsonify({"error": "Not found"}), 404

    file_path = media.file_url.replace("/static/", "static/")

    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(media)
    db.session.commit()

    return jsonify({"message": "Media deleted"})


# =========================
# DELETE ALL MEDIA FOR ARTICLE
# =========================
@media_bp.route("/article/<int:article_id>", methods=["DELETE"])
@jwt_required()
def delete_all_media(article_id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    media_files = Media.query.filter_by(article_id=article_id).all()

    for media in media_files:
        file_path = media.file_url.replace("/static/", "static/")
        if os.path.exists(file_path):
            os.remove(file_path)
        db.session.delete(media)

    db.session.commit()

    return jsonify({"message": "All media deleted for article"})