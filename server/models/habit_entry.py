from datetime import date
from . import db

class HabitEntry(db.Model):
    __tablename__ = "habit_entries"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False, default=date.today)
    status = db.Column(db.String(20), nullable=False)  # e.g. "done", "missed"
    note = db.Column(db.Text)

    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)