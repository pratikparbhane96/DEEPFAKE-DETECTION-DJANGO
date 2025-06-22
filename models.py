import uuid
from django.db import models

class ImageAnalysis(models.Model):
    image_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  # Automatically generate UUID
    is_real = models.BooleanField()
    confidence = models.FloatField()
    emotion = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis {self.image_id} - {'Real' if self.is_real else 'Fake'}"
