from django.contrib import admin
from .models import (
    UserProfile, MedicationSchedule, MedicationIntake,
    SymptomCheckIn, MentalHealthCheckIn, Notification, SupportMessage
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'patient_id', 'treatment_start_date', 'treatment_end_date']
    list_filter = ['role', 'treatment_start_date']
    search_fields = ['user__username', 'patient_id']


@admin.register(MedicationSchedule)
class MedicationScheduleAdmin(admin.ModelAdmin):
    list_display = ['medication_name', 'patient', 'dosage', 'frequency', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active', 'start_date']
    search_fields = ['medication_name', 'patient__username']


@admin.register(MedicationIntake)
class MedicationIntakeAdmin(admin.ModelAdmin):
    list_display = ['schedule', 'scheduled_datetime', 'verified_datetime', 'status', 'confidence_score']
    list_filter = ['status', 'scheduled_datetime']
    search_fields = ['schedule__medication_name', 'schedule__patient__username']


@admin.register(SymptomCheckIn)
class SymptomCheckInAdmin(admin.ModelAdmin):
    list_display = ['patient', 'check_in_date', 'risk_score', 'requires_attention']
    list_filter = ['requires_attention', 'check_in_date']
    search_fields = ['patient__username']


@admin.register(MentalHealthCheckIn)
class MentalHealthCheckInAdmin(admin.ModelAdmin):
    list_display = ['patient', 'check_in_date', 'mood_score', 'disengagement_risk_score', 'requires_support']
    list_filter = ['requires_support', 'check_in_date']
    search_fields = ['patient__username']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'notification_type', 'title', 'is_read', 'sent_at']
    list_filter = ['notification_type', 'is_read', 'sent_at']
    search_fields = ['recipient__username', 'title']


@admin.register(SupportMessage)
class SupportMessageAdmin(admin.ModelAdmin):
    list_display = ['patient', 'message_type', 'created_at']
    list_filter = ['message_type', 'created_at']
    search_fields = ['patient__username', 'message']

