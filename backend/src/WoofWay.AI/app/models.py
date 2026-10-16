# models.py - ovo je za txt
from pydantic import BaseModel # type: ignore
from typing import List

class PredictionResult(BaseModel):
    breed: str
    confidence: float

class PredictionResponse(BaseModel):
    filename: str
    imageUrl: str
    predictions: List[PredictionResult]
    status: str