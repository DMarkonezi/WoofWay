# db_service.py
from pymongo import MongoClient # type: ignore

client = MongoClient("mongodb://admin:password@mongodb:27017/")
db = client["WoofWayDb"]
collection = db["predictions"]

def save_prediction(doc: dict):
    collection.insert_one(doc)