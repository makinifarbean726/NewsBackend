from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from extensions import db
from models import Article, Media

article_bp = Blueprint("articles", __name__, url_prefix="/api/articles")


# =========================
# CREATE ARTICLE (ADMIN ONLY)
# FIX: supports JSON + FormData safely
# =========================
@article_bp.route("", methods=["POST"])
@jwt_required()
def create_article():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    # 🔥 FIX: supports BOTH JSON and form-data
    data = request.get_json() or request.form

    title = data.get("title")
    slug = data.get("slug")
    content = data.get("content")

    if not title or not slug or not content:
        return jsonify({"error": "title, slug, content required"}), 400

    article = Article(
        title=title,
        slug=slug,
        content=content,
        status=data.get("status", "draft"),
        author_id=int(claims.get("sub")),
        category_id=data.get("category_id")
    )

    db.session.add(article)
    db.session.commit()

    return jsonify({
        "message": "Article created",
        "article_id": article.id
    }), 201


# =========================
# GET ALL PUBLISHED ARTICLES
# =========================
@article_bp.route("", methods=["GET"])
def get_articles():
    articles = Article.query.filter_by(status="published")\
        .order_by(Article.created_at.desc())\
        .all()

    result = []

    for a in articles:
        result.append({
            "id": a.id,
            "title": a.title,
            "slug": a.slug,
            "content": a.content,
            "views": a.views,
            "created_at": a.created_at,

            # =========================
            # CATEGORY (NEW)
            # =========================
            "category": {
                "id": a.category.id,
                "name": a.category.name,
                "slug": a.category.slug
            } if a.category else None,

            # =========================
            # MEDIA (USING RELATIONSHIP)
            # =========================
            "media": [
                {
                    "id": m.id,
                    "file_url": m.file_url,
                    "file_type": m.file_type,
                    "title": m.title
                }
                for m in a.media
            ]
        })

    return jsonify(result)

# =========================
# GET SINGLE ARTICLE
# =========================
@article_bp.route("/<string:slug>", methods=["GET"])
def get_article(slug):
    article = Article.query.filter_by(slug=slug, status="published").first()

    if not article:
        return jsonify({"error": "Not found"}), 404

    # increment views
    article.views += 1
    db.session.commit()

    return jsonify({
        "id": article.id,
        "title": article.title,
        "slug": article.slug,
        "content": article.content,
        "views": article.views,
        "comment_count": len(article.comments),
        "created_at": article.created_at,

        # =========================
        # CATEGORY (NEW)
        # =========================
        "category": {
            "id": article.category.id,
            "name": article.category.name,
            "slug": article.category.slug
        } if article.category else None,

        # =========================
        # MEDIA (NEW)
        # =========================
        "media": [
            {
                "id": m.id,
                "file_url": m.file_url,
                "file_type": m.file_type,
                "title": m.title
            }
            for m in article.media
        ]
    })

# =========================
# UPDATE ARTICLE
# =========================
@article_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_article(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    article = Article.query.get(id)

    if not article:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json() or request.form

    article.title = data.get("title", article.title)
    article.slug = data.get("slug", article.slug)
    article.content = data.get("content", article.content)
    article.status = data.get("status", article.status)

    db.session.commit()

    return jsonify({"message": "Article updated"})


# =========================
# DELETE ARTICLE
# =========================
@article_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_article(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    article = Article.query.get(id)

    if not article:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(article)
    db.session.commit()

    return jsonify({"message": "Article deleted"})


# =========================
# ADMIN GET ALL (INCLUDING DRAFTS)
# =========================
@article_bp.route("/admin/all", methods=["GET"])
@jwt_required()
def admin_get_all():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    articles = Article.query.order_by(Article.created_at.desc()).all()

    return jsonify([
        {
            "id": a.id,
            "title": a.title,
            "slug": a.slug,
            "status": a.status,
            "created_at": a.created_at
        }
        for a in articles
    ])