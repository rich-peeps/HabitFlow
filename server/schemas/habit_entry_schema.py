from marshmallow import Schema, fields

class HabitEntrySchema(Schema):
    id = fields.Int(dump_only=True)
    date = fields.Date()
    status = fields.Str(required=True)
    note = fields.Str(allow_none=True)
    habit_id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)

habit_entry_schema = HabitEntrySchema()
habit_entries_schema = HabitEntrySchema(many=True)