from datetime import datetime
from extensions import db


# ================= USER =================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="admin")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    articles = db.relationship(
        "Article",
        backref="author",
        lazy=True,
        cascade="all, delete-orphan"
    )


# ================= CATEGORY =================
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)

    # relationship
    articles = db.relationship("Article", backref="category", lazy=True)


# ================= ARTICLE =================
class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)

    status = db.Column(db.String(20), default="draft")

    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    media = db.relationship(
        "Media",
        backref="article",
        lazy=True,
        cascade="all, delete-orphan"
    )

    comments = db.relationship(
        "Comment",
        backref="article",
        lazy=True,
        cascade="all, delete-orphan"
    )


# ================= MEDIA =================
class Media(db.Model):
    __tablename__ = "media"

    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=True)

    file_url = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50))
    title = db.Column(db.String(255))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ================= COMMENT =================
class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    message = db.Column(db.Text)

    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)