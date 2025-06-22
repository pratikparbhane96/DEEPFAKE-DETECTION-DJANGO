#import base64
#import io
#import uuid
#import logging
#from PIL import Image
#import torch
#from rest_framework.views import APIView
#from rest_framework.response import Response
#from rest_framework import status
#from transformers import AutoImageProcessor, AutoModelForImageClassification
#from .models import ImageAnalysis
#
## Setting up logger
#logger = logging.getLogger(__name__)
#
#class DeepfakeDetectorView(APIView):
#    def __init__(self, *args, **kwargs):
#        super().__init__(*args, **kwargs)
#        # Load model and processor only once at initialization
#        self.processor = AutoImageProcessor.from_pretrained("prithivMLmods/Deep-Fake-Detector-Model")
#        self.model = AutoModelForImageClassification.from_pretrained("prithivMLmods/Deep-Fake-Detector-Model")
#        
#    def process_image(self, image_data):
#        # Convert base64 to PIL Image
#        if isinstance(image_data, str) and image_data.startswith('data:image'):
#            image_data = image_data.split(',')[1]
#        
#        try:
#            # Decode base64 image data
#            image_bytes = base64.b64decode(image_data)
#            image = Image.open(io.BytesIO(image_bytes))
#            
#            # Ensure the image is in RGB format
#            image = image.convert("RGB")
#            
#            # Resize image to the required dimensions (e.g., 224x224)
#            image = image.resize((224, 224))
#            
#        except Exception as e:
#            logger.error(f"Error decoding image: {e}")
#            raise ValueError("Invalid image data")
#        
#        # Process image for model
#        inputs = self.processor(image, return_tensors="pt")
#        
#        with torch.no_grad():
#            outputs = self.model(**inputs)
#            predictions = outputs.logits.softmax(dim=-1)
#        
#        # Get prediction results
#        is_real = predictions[0][1].item() > 0.5
#        confidence = predictions[0][1].item() if is_real else predictions[0][0].item()
#        
#        # Mock emotion detection (in production, you'd use a separate emotion detection model)
#        emotions = ["neutral", "happy", "sad", "angry", "surprised"]
#        emotion = emotions[torch.randint(0, len(emotions), (1,)).item()]
#        
#        return is_real, confidence, emotion
#
#    def post(self, request):
#        try:
#            image_data = request.data.get('image')
#            if not image_data:
#                return Response(
#                    {'error': 'No image data provided'}, 
#                    status=status.HTTP_400_BAD_REQUEST
#                )
#
#            # Process image and get predictions
#            is_real, confidence, emotion = self.process_image(image_data)
#            
#            # Create analysis record
#            analysis = ImageAnalysis.objects.create(
#                image_id=uuid.uuid4(),
#                is_real=is_real,
#                confidence=confidence,
#                emotion=emotion
#            )
#            
#            # Return response with prediction and analysis details
#            return Response({
#                'isReal': is_real,
#                'confidence': str(round(confidence, 2)),
#                'emotion': emotion,
#                'timestamp': analysis.timestamp.isoformat(),
#                'image_id': str(analysis.image_id)  # Return the unique analysis ID
#            })
#            
#        except ValueError as e:
#            return Response(
#                {'error': str(e)}, 
#                status=status.HTTP_400_BAD_REQUEST
#            )
#        except Exception as e:
#            logger.error(f"Error processing the image: {e}")
#            return Response(
#                {'error': 'An internal error occurred. Please try again later.'}, 
#                status=status.HTTP_500_INTERNAL_SERVER_ERROR
#            )
#
import base64
import io
import uuid
import logging
from PIL import Image
import torch
import torch.nn.functional as F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from facenet_pytorch import MTCNN, InceptionResnetV1
from .models import ImageAnalysis

logger = logging.getLogger(__name__)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize Face Detector and Model
mtcnn = MTCNN(select_largest=False, post_process=False, device=DEVICE)
model = InceptionResnetV1(pretrained="vggface2", classify=True, num_classes=1).to(DEVICE)

# Load trained model weights
checkpoint_path = "detector/model_assets/resnetinceptionv1_epoch_32.pth"
checkpoint = torch.load(checkpoint_path, map_location=DEVICE)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

class DeepfakeDetectorView(APIView):
    def process_image(self, image_data):
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]

        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            logger.error(f"Image decoding failed: {e}")
            raise ValueError("Invalid image data")

        # Detect face
        face = mtcnn(image)
        if face is None:
            raise ValueError("No face detected")

        face = face.unsqueeze(0)
        face = F.interpolate(face, size=(256, 256), mode="bilinear", align_corners=False)
        face = face.to(DEVICE).float() / 255.0

        with torch.no_grad():
            output = torch.sigmoid(model(face)).item()

        is_fake = output >= 0.5
        confidence = output if is_fake else 1 - output
        pred_label = "fake" if is_fake else "real"

        emotions = ["neutral", "happy", "sad", "angry", "surprised"]
        emotion = emotions[torch.randint(0, len(emotions), (1,)).item()]

        return not is_fake, confidence, emotion, pred_label

    def post(self, request):
        try:
            image_data = request.data.get("image")
            if not image_data:
                return Response({"error": "No image provided"}, status=400)

            is_real, confidence, emotion, pred_label = self.process_image(image_data)

            analysis = ImageAnalysis.objects.create(
                image_id=uuid.uuid4(),
                is_real=is_real,
                confidence=confidence,
                emotion=emotion
            )

            return Response({
                "isReal": is_real,
                "confidence": str(round(confidence, 4)),
                "emotion": emotion,
                "predictionLabel": pred_label,
                "timestamp": analysis.timestamp.isoformat(),
                "image_id": str(analysis.image_id)
            })

        except ValueError as ve:
            return Response({"error": str(ve)}, status=400)
        except Exception as e:
            logger.exception("Internal server error")
            return Response({"error": "Internal server error"}, status=500)
