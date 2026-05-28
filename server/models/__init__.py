from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

from .user import User  # noqa: E402,F401
from .habits import Habit  # noqa: E402,F401
from .habit_entry import HabitEntry  # noqa: E402,F401