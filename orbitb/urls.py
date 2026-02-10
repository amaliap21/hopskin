"""
URL configuration for OrbiTB app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, MedicationScheduleViewSet, MedicationIntakeViewSet,
    SymptomCheckInViewSet, MentalHealthCheckInViewSet, NotificationViewSet,
    RiskAssessmentViewSet
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='userprofile')
router.register(r'schedules', MedicationScheduleViewSet, basename='schedule')
router.register(r'intakes', MedicationIntakeViewSet, basename='intake')
router.register(r'symptoms', SymptomCheckInViewSet, basename='symptom')
router.register(r'mental-health', MentalHealthCheckInViewSet, basename='mentalhealth')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'risk-assessment', RiskAssessmentViewSet, basename='risk')

urlpatterns = [
    path('', include(router.urls)),
]
