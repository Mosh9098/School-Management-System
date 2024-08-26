import os
import cloudinary
import cloudinary.uploader
import cloudinary.api

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///your_database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_default_secret_key')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'no-reply@studysphereapp.com') 
    
