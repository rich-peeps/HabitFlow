from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User  # noqa: E402,F401
from .habit import Habit  # noqa: E402,F401
from .habit_entry import HabitEntry  # noqa: E402,F401