from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


class Config:
    SECRET_KEY = 'MUSHUSSNUSAPA127598435845703'
    DB_PATH = 'forum.db'

app.config.from_object(Config)


