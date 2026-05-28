from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from .config import config_map
from .models import db, bcrypt

jwt = JWTManager()
migrate = Migrate()

def create_app(env_name="development"):
    app = Flask(__name__)
    app.config.from_object(config_map[env_name])

    CORS(app, origins=["http://localhost:5173"])

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    from .routes.auth import auth_bp
    from .routes.habits import habits_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(habits_bp, url_prefix="/api")

    @app.get("/health")
    def health():
        return {"status": "ok"}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5555)
