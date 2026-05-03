from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
import re

from extensions import db
from models import Category

category_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


def generate_slug(name):
    slug = name.lower()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    return slug.strip("-")


def unique_slug(name):
    base = generate_slug(name)
    slug = base
    count = 1

    while Category.query.filter_by(slug=slug).first():
        slug = f"{base}-{count}"
        count += 1

    return slug


@category_bp.route("/", methods=["POST"])
@jwt_required()
def create_category():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json() or request.form

    name = data.get("name")

    if not name:
        return jsonify({"error": "name required"}), 400

    slug = unique_slug(name)

    category = Category(
        name=name,
        slug=slug
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        "message": "Category created",
        "category_id": category.id,
        "slug": category.slug
    }), 201


@category_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "articles": [
                {
                    "id": a.id,
                    "title": a.title,
                    "slug": a.slug
                }
                for a in c.articles
            ]
        }
        for c in categories
    ])


@category_bp.route("/<string:slug>", methods=["GET"])
def get_category(slug):
    category = Category.query.filter_by(slug=slug).first()

    if not category:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "id": category.id,
        "name": category.name,
        "slug": category.slug,
        "articles": [
            {
                "id": a.id,
                "title": a.title,
                "slug": a.slug
            }
            for a in category.articles
        ]
    })


@category_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_category(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    category = Category.query.get(id)

    if not category:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json() or request.form

    if "name" in data:
        category.name = data["name"]
        category.slug = unique_slug(data["name"])

    db.session.commit()

    return jsonify({"message": "Category updated"})


@category_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    category = Category.query.get(id)

    if not category:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": "Category deleted"})