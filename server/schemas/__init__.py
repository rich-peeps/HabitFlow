from marshmallow import Schema, fields
from .user_schema import user_schema, users_schema
from .habit_schema import habit_schema, habits_schema
from .habit_entry_schema import habit_entry_schema, habit_entries_schema

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Email()

user_schema = UserSchema()