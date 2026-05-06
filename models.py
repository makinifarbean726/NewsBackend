from datetime import datetime
from extensions import db

# Article ↔ Category (Many-to-Many)
article_category = db.Table(
    "article_category",
    db.Column("article_id", db.Integer, db.ForeignKey("articles.id"), primary_key=True),
    db.Column("category_id", db.Integer, db.ForeignKey("categories.id"), primary_key=True)
)

# Article ↔ Article (Related Articles)
related_articles = db.Table(
    "related_articles",
    db.Column("article_id", db.Integer, db.ForeignKey("articles.id"), primary_key=True),
    db.Column("related_id", db.Integer, db.ForeignKey("articles.id"), primary_key=True)
)

# USER
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # relationships
    articles = db.relationship(
        "Article",
        backref="author",
        lazy=True,
        cascade="all, delete-orphan"
    )

# CATEGORY
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)

    # MANY-TO-MANY RELATIONSHIP
    articles = db.relationship(
        "Article",
        secondary="article_category",  # string safer for migrations
        back_populates="categories",
        lazy="dynamic"
    )

# ARTICLE
class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)

    status = db.Column(db.String(20), default="posted")

    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    views = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # MEDIA
    media = db.relationship(
        "Media",
        backref="article",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # COMMENTS
    comments = db.relationship(
        "Comment",
        backref="article",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # MANY-TO-MANY CATEGORIES
    categories = db.relationship(
        "Category",
        secondary=article_category,
        back_populates="articles"
    )

    # SELF-REFERENCING MANY-TO-MANY (RELATED ARTICLES)
    related = db.relationship(
        "Article",
        secondary=related_articles,
        primaryjoin=id == related_articles.c.article_id,
        secondaryjoin=id == related_articles.c.related_id,
        backref="related_to"
    )

# MEDIA
class Media(db.Model):
    __tablename__ = "media"

    id = db.Column(db.Integer, primary_key=True)

    article_id = db.Column(
        db.Integer,
        db.ForeignKey("articles.id", ondelete="CASCADE"),
        nullable=False
    )

    file_url = db.Column(db.String(255), nullable=False)

    # better classification
    file_type = db.Column(db.String(50))  # image, video, audio, pdf

    title = db.Column(db.String(255))

    # optional ordering (important for UI)
    position = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# COMMENT
class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# MESSAGE (CHAT)
class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100))     # optional (guest name)
    email = db.Column(db.String(120))   # optional (guest contact)

    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)