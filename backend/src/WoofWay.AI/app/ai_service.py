from transformers import pipeline # type: ignore
from PIL import Image

class DogClassifier:
    def __init__(self):
        self.model = pipeline(
            "image-classification", 
            model="wesleyacheng/dog-breeds-multiclass-image-classification-with-vit"
        )
    
    def predict(self, image: Image.Image):
        return self.model(image, top_k=3)