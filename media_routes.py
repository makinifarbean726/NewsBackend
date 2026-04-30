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


# =========================
# HELPERS
# =========================
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# =========================
# UPLOAD MEDIA (ADMIN ONLY)
# =========================
@media_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_media():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    # optional article validation
    article_id = request.form.get("article_id")

    if article_id:
        article = Article.query.get(article_id)
        if not article:
            return jsonify({"error": "Article not found"}), 404

    # save file
    filename = secure_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{filename}"

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    filepath = os.path.join(UPLOAD_FOLDER, unique_name)
    file.save(filepath)

    media = Media(
        article_id=int(article_id) if article_id else None,
        file_url=f"/static/uploads/{unique_name}",
        file_type=filename.rsplit(".", 1)[1].lower(),
        title=request.form.get("title", filename)
    )

    db.session.add(media)
    db.session.commit()

    return jsonify({
        "message": "File uploaded",
        "media_id": media.id,
        "file_url": media.file_url
    }), 201


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
# DELETE MEDIA (ADMIN ONLY)
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

    # delete file from disk
    file_path = media.file_url.replace("/static/", "static/")

    if os.path.exists(file_path):
        os.remove(file_path)

    db.session.delete(media)
    db.session.commit()

    return jsonify({"message": "Media deleted"})