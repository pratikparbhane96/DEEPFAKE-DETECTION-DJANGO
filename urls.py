from django.urls import path
from .views import DeepfakeDetectorView

urlpatterns = [
    path('analyze/', DeepfakeDetectorView.as_view(), name='analyze'),
]