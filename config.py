import os

class Config:
    " Base configuration class.
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///college_allocator.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
