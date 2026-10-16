import io
import logging
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

import cloudinary.uploader

from app.ai_service import DogClassifier
from app.db_service import save_prediction
from app.cloudinary_config import cloudinary

from app.models import PredictionResult, PredictionResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("woofway-ai")

app = FastAPI(title="WoofWay CV Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

classifier = None

@app.on_event("startup")
def startup():
    global classifier
    classifier = DogClassifier()


@app.get("/health")
def health():
    return {
        "status": "online"
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):

    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        
        image_bytes = await file.read()

        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")

        upload_result = cloudinary.uploader.upload(image_bytes)
        image_url = upload_result["secure_url"]

        results = classifier.predict(image)

        predictions = [
            PredictionResult(
                breed=res["label"],
                confidence=float(res["score"])
            )
            for res in results
        ]

        doc = {
            "filename": file.filename,
            "imageUrl": image_url,
            "predictions": [p.model_dump() for p in predictions],
            "createdAt": datetime.utcnow()
        }

        background_tasks.add_task(save_prediction, doc)

        return {
            "filename": file.filename,
            "imageUrl": image_url,
            "predictions": predictions,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")