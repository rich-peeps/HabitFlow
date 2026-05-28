from datetime import date
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..models import db, Habit, HabitEntry, User
from ..schemas import habit_schema, habits_schema, habit_entry_schema, habit_entries_schema

habits_bp = Blueprint("habits_bp", __name__)

def current_user():
    user_id = int(get_jwt_identity())
    return User.query.get_or_404(user_id)

@habits_bp.get("/habits")
@jwt_required()
def list_habits():
    user = current_user()
    return habits_schema.dump(user.habits), 200

@habits_bp.post("/habits")
@jwt_required()
def create_habit():
    user = current_user()
    data = request.get_json() or {}
    errors = habit_schema.validate(data)
    if errors:
        return {"errors": errors}, 400

    habit = Habit(
        name=data["name"],
        category=data.get("category"),
        target_per_week=data.get("target_per_week"),
        user_id=user.id,
    )
    db.session.add(habit)
    db.session.commit()
    return habit_schema.dump(habit), 201

@habits_bp.get("/habits/<int:habit_id>")
@jwt_required()
def get_habit(habit_id):
    user = current_user()
    habit = Habit.query.filter_by(id=habit_id, user_id=user.id).first_or_404()
    return habit_schema.dump(habit), 200

@habits_bp.patch("/habits/<int:habit_id>")
@jwt_required()
def update_habit(habit_id):
    user = current_user()
    habit = Habit.query.filter_by(id=habit_id, user_id=user.id).first_or_404()

    data = request.get_json() or {}
    errors = habit_schema.validate(data, partial=True)
    if errors:
        return {"errors": errors}, 400

    for field in ["name", "category", "target_per_week"]:
        if field in data:
            setattr(habit, field, data[field])

    db.session.commit()
    return habit_schema.dump(habit), 200

@habits_bp.delete("/habits/<int:habit_id>")
@jwt_required()
def delete_habit(habit_id):
    user = current_user()
    habit = Habit.query.filter_by(id=habit_id, user_id=user.id).first_or_404()
    db.session.delete(habit)
    db.session.commit()
    return {}, 204

@habits_bp.get("/habits/<int:habit_id>/entries")
@jwt_required()
def list_entries(habit_id):
    user = current_user()
    habit = Habit.query.filter_by(id=habit_id, user_id=user.id).first_or_404()
    return habit_entries_schema.dump(habit.entries), 200

@habits_bp.post("/habits/<int:habit_id>/entries")
@jwt_required()
def create_entry(habit_id):
    user = current_user()
    habit = Habit.query.filter_by(id=habit_id, user_id=user.id).first_or_404()

    data = request.get_json() or {}
    errors = habit_entry_schema.validate(data, partial=("date",))
    if errors:
        return {"errors": errors}, 400

    entry = HabitEntry(
        date=data.get("date", date.today()),
        status=data["status"],
        note=data.get("note"),
        habit_id=habit.id,
        user_id=user.id,
    )
    db.session.add(entry)
    db.session.commit()
    return habit_entry_schema.dump(entry), 201

@habits_bp.patch("/entries/<int:entry_id>")
@jwt_required()
def update_entry(entry_id):
    user = current_user()
    entry = HabitEntry.query.filter_by(id=entry_id, user_id=user.id).first_or_404()

    data = request.get_json() or {}
    errors = habit_entry_schema.validate(data, partial=True)
    if errors:
        return {"errors": errors}, 400

    for field in ["date", "status", "note"]:
        if field in data:
            setattr(entry, field, data[field])

    db.session.commit()
    return habit_entry_schema.dump(entry), 200

@habits_bp.delete("/entries/<int:entry_id>")
@jwt_required()
def delete_entry(entry_id):
    user = current_user()
    entry = HabitEntry.query.filter_by(id=entry_id, user_id=user.id).first_or_404()
    db.session.delete(entry)
    db.session.commit()
    return {}, 204

@habits_bp.get("/today")
@jwt_required()
def today():
    user = current_user()
    today_date = date.today()

    habits = Habit.query.filter_by(user_id=user.id).all()
    result = []

    for habit in habits:
        todays_entry = HabitEntry.query.filter_by(
            user_id=user.id, habit_id=habit.id, date=today_date
        ).first()
        result.append({
            "habit": habit_schema.dump(habit),
            "entry": habit_entry_schema.dump(todays_entry) if todays_entry else None,
        })

    return result, 200