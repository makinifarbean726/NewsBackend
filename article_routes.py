from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import re

from extensions import db
from models import Article, Media, Category

article_bp = Blueprint("articles", __name__, url_prefix="/api/articles")

# SLUG
def generate_slug(title):
    slug = title.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)  # remove punctuation
    slug = re.sub(r"\s+", "-", slug)      # spaces → dash
    return slug.strip("-")

def unique_slug(title):
    base = generate_slug(title)
    slug = base
    count = 1

    while Article.query.filter_by(slug=slug).first():
        slug = f"{base}-{count}"
        count += 1

    return slug

# CREATE ARTICLE (ADMIN)
@article_bp.route("", methods=["POST"])
@jwt_required()
def create_article():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or request.form

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "title, content required"}), 400

    # 🔥 AUTO SLUG
    slug = unique_slug(title)

    article = Article(
        title=title,
        slug=slug,
        content=content,
        status=data.get("status", "posted"),
        author_id=int(claims.get("sub")),
    )

    db.session.add(article)
    db.session.flush()

    #MULTIPLE CATEGORIES
    category_ids = data.get("category_ids", [])
    if isinstance(category_ids, str):
        category_ids = [int(i) for i in category_ids.split(",") if i]
    if category_ids:
        categories = Category.query.filter(Category.id.in_(category_ids)).all()
        article.categories = categories

   #RELATED ARTICLES
    related_ids = data.get("related_ids", [])
    if isinstance(related_ids, str):
        related_ids = [int(i) for i in related_ids.split(",") if i]
    if related_ids:
        related_articles = Article.query.filter(
            Article.id.in_(related_ids)
        ).all()
        article.related = related_articles

    db.session.commit()

    return jsonify({
        "message": "Article created",
        "article_id": article.id,
        "slug": article.slug
    }), 201

# GET ALL ARTICLES
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
            "categories": [
                {
                    "id": c.id,
                    "name": c.name,
                    "slug": c.slug
                }
                for c in a.categories
            ],
            "related": [
                {
                    "id": r.id,
                    "title": r.title,
                    "slug": r.slug
                }
                for r in a.related
            ],
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

# GET SINGLE ARTICLE
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
        "categories": [
            {
                "id": c.id,
                "name": c.name,
                "slug": c.slug
            }
            for c in article.categories
        ],
        "related": [
            {
                "id": r.id,
                "title": r.title,
                "slug": r.slug
            }
            for r in article.related
        ],
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

# UPDATE ARTICLE
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

    # update title + slug
    if "title" in data:
        article.title = data["title"]
        article.slug = unique_slug(data["title"])

    article.content = data.get("content", article.content)
    article.status = data.get("status", article.status)

    # UPDATE CATEGORIES
    if "category_ids" in data:
        category_ids = data.get("category_ids")

        if isinstance(category_ids, str):
            category_ids = [int(i) for i in category_ids.split(",") if i]

        categories = Category.query.filter(
            Category.id.in_(category_ids)
        ).all()

        article.categories = categories

    # UPDATE RELATED
    if "related_ids" in data:
        related_ids = data.get("related_ids")

        if isinstance(related_ids, str):
            related_ids = [int(i) for i in related_ids.split(",") if i]

        related_articles = Article.query.filter(
            Article.id.in_(related_ids)
        ).all()

        article.related = related_articles

    db.session.commit()

    return jsonify({"message": "Article updated"})


# DELETE ARTICLE
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
