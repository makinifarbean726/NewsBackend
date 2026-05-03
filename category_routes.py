from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from extensions import db
from models import Category

category_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


# =========================
# CREATE CATEGORY (ADMIN ONLY)
# =========================
@category_bp.route("/", methods=["POST"])
@jwt_required()
def create_category():
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    data = request.get_json()

    if not data.get("name") or not data.get("slug"):
        return jsonify({"error": "name and slug required"}), 400

    # prevent duplicates
    existing = Category.query.filter_by(slug=data.get("slug")).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 400

    category = Category(
        name=data.get("name"),
        slug=data.get("slug")
    )

    db.session.add(category)
    db.session.commit()

    return jsonify({
        "message": "Category created",
        "category_id": category.id
    }), 201


# =========================
# GET ALL CATEGORIES (PUBLIC)
# =========================
@category_bp.route("", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug
        }
        for c in categories
    ])


# =========================
# GET SINGLE CATEGORY
# =========================
@category_bp.route("/<string:slug>", methods=["GET"])
def get_category(slug):
    category = Category.query.filter_by(slug=slug).first()

    if not category:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "id": category.id,
        "name": category.name,
        "slug": category.slug
    })


# =========================
# UPDATE CATEGORY (ADMIN ONLY)
# =========================
@category_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_category(id):
    claims = get_jwt()

    if claims.get("role") != "admin":
        return jsonify({"error": "Forbidden"}), 403

    category = Category.query.get(id)

    if not category:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json()

    category.name = data.get("name", category.name)
    category.slug = data.get("slug", category.slug)

    db.session.commit()

    return jsonify({"message": "Category updated"})


# =========================
# DELETE CATEGORY (ADMIN ONLY)
# =========================
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