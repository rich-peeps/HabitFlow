from marshmallow import Schema, fields

class HabitSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    category = fields.Str()
    target_per_week = fields.Int(allow_none=True)
    user_id = fields.Int(dump_only=True)

habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)