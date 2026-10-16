# config.py
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@mongodb:27017/")
MODEL_NAME = "nateraw/dog-breed-classifier"