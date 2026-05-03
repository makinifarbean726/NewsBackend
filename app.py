from flask import Flask
from dotenv import load_dotenv
import os
from flask_cors import CORS

from extensions import db, migrate, jwt

from auth import auth_bp
from article_routes import article_bp
from media_routes import media_bp
from comment_routes import comment_bp
from category_routes import category_bp
from message_routes import message_bp

# =========================
# LOAD ENV FIRST
# =========================
load_dotenv()


# =========================
# CREATE APP (ONLY ONCE)
# =========================
app = Flask(__name__)


# =========================
# CONFIG
# =========================
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///news.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback")


# =========================
# ENABLE CORS (IMPORTANT)
# =========================

CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:5173",
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})


# =========================
# INIT EXTENSIONS
# =========================
db.init_app(app)
migrate.init_app(app, db)
jwt.init_app(app)


# =========================
# REGISTER BLUEPRINTS
# =========================
app.register_blueprint(auth_bp)
app.register_blueprint(article_bp)
app.register_blueprint(media_bp)
app.register_blueprint(comment_bp)
app.register_blueprint(category_bp)
app.register_blueprint(message_bp)


# =========================
# TEST ROUTE
# =========================
@app.route("/")
def home():
    return "Backend running 🚀"


# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    app.run(debug=True)