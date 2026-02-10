"""
Serializers for OrbiTB API.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, MedicationSchedule, MedicationIntake,
    SymptomCheckIn, MentalHealthCheckIn, Notification, SupportMessage
)


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profiles."""
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'role', 'phone_number',
            'patient_id', 'treatment_start_date', 'treatment_end_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicationScheduleSerializer(serializers.ModelSerializer):
    """Serializer for medication schedules."""
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    
    class Meta:
        model = MedicationSchedule
        fields = [
            'id', 'patient', 'patient_name', 'medication_name', 'dosage',
            'frequency', 'scheduled_times', 'start_date', 'end_date',
            'is_active', 'reminder_advance_minutes', 'verification_window_minutes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicationIntakeSerializer(serializers.ModelSerializer):
    """Serializer for medication intake records."""
    medication_name = serializers.CharField(source='schedule.medication_name', read_only=True)
    patient_name = serializers.CharField(source='schedule.patient.username', read_only=True)
    
    class Meta:
        model = MedicationIntake
        fields = [
            'id', 'schedule', 'medication_name', 'patient_name',
            'scheduled_datetime', 'verified_datetime', 'status',
            'medication_detected', 'face_detected', 'position_verified',
            'confidence_score', 'notes', 'reminder_sent', 'escalation_sent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MedicationVerificationSerializer(serializers.Serializer):
    """Serializer for medication verification submission."""
    intake_id = serializers.IntegerField()
    image_base64 = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)


class SymptomCheckInSerializer(serializers.ModelSerializer):
    """Serializer for symptom check-ins."""
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    
    class Meta:
        model = SymptomCheckIn
        fields = [
            'id', 'patient', 'patient_name', 'check_in_date',
            'cough', 'fever', 'night_sweats', 'weight_loss', 'fatigue', 'chest_pain',
            'nausea', 'appetite_loss', 'vision_problems', 'joint_pain',
            'additional_notes', 'risk_score', 'requires_attention', 'created_at'
        ]
        read_only_fields = ['id', 'risk_score', 'requires_attention', 'created_at']


class MentalHealthCheckInSerializer(serializers.ModelSerializer):
    """Serializer for mental health check-ins."""
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    
    class Meta:
        model = MentalHealthCheckIn
        fields = [
            'id', 'patient', 'patient_name', 'check_in_date',
            'mood_score', 'stress_level', 'motivation_level', 'sleep_quality',
            'feeling_supported', 'treatment_burden', 'notes',
            'disengagement_risk_score', 'requires_support', 'created_at'
        ]
        read_only_fields = ['id', 'disengagement_risk_score', 'requires_support', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_name', 'notification_type',
            'title', 'message', 'is_read', 'sent_at'
        ]
        read_only_fields = ['id', 'sent_at']


class SupportMessageSerializer(serializers.ModelSerializer):
    """Serializer for support messages."""
    
    class Meta:
        model = SupportMessage
        fields = ['id', 'patient', 'message', 'message_type', 'created_at']
        read_only_fields = ['id', 'created_at']


class AdherenceStatsSerializer(serializers.Serializer):
    """Serializer for adherence statistics."""
    total_scheduled = serializers.IntegerField()
    total_verified = serializers.IntegerField()
    total_missed = serializers.IntegerField()
    adherence_rate = serializers.FloatField()
    current_streak = serializers.IntegerField()
    last_7_days = serializers.DictField()


class RiskAssessmentSerializer(serializers.Serializer):
    """Serializer for patient risk assessment."""
    patient_id = serializers.IntegerField()
    patient_name = serializers.CharField()
    overall_risk_score = serializers.FloatField()
    adherence_risk = serializers.FloatField()
    symptom_risk = serializers.FloatField()
    mental_health_risk = serializers.FloatField()
    risk_level = serializers.CharField()
    requires_intervention = serializers.BooleanField()
    recommendations = serializers.ListField(child=serializers.CharField())
