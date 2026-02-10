"""
Django models for OrbiTB tuberculosis treatment adherence system.
"""
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone


class UserRole(models.TextChoices):
    """User roles in the system."""
    PATIENT = 'patient', 'Patient'
    CAREGIVER = 'caregiver', 'Caregiver'
    HEALTHCARE_WORKER = 'healthcare_worker', 'Healthcare Worker'


class UserProfile(models.Model):
    """Extended user profile with role information."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.PATIENT)
    phone_number = models.CharField(max_length=20, blank=True)
    
    # For patients
    patient_id = models.CharField(max_length=50, blank=True, unique=True, null=True)
    treatment_start_date = models.DateField(null=True, blank=True)
    treatment_end_date = models.DateField(null=True, blank=True)
    
    # Relationships
    caregivers = models.ManyToManyField(
        'self',
        symmetrical=False,
        related_name='patients_cared_for',
        blank=True,
        limit_choices_to={'role': UserRole.CAREGIVER}
    )
    healthcare_workers = models.ManyToManyField(
        'self',
        symmetrical=False,
        related_name='patients_managed',
        blank=True,
        limit_choices_to={'role': UserRole.HEALTHCARE_WORKER}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"


class MedicationSchedule(models.Model):
    """Medication schedule for TB treatment."""
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medication_schedules'
    )
    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, help_text="e.g., 'Once daily', 'Twice daily'")
    scheduled_times = models.JSONField(
        help_text="List of scheduled times in HH:MM format, e.g., ['09:00', '21:00']"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    # Reminder settings
    reminder_advance_minutes = models.IntegerField(
        default=15,
        help_text="How many minutes before scheduled time to send reminder"
    )
    verification_window_minutes = models.IntegerField(
        default=60,
        help_text="How many minutes after scheduled time before escalation"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['scheduled_times']
    
    def __str__(self):
        return f"{self.medication_name} - {self.patient.username}"


class MedicationIntake(models.Model):
    """Record of medication intake verification."""
    
    class VerificationStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        VERIFIED = 'verified', 'Verified'
        MISSED = 'missed', 'Missed'
        PARTIALLY_VERIFIED = 'partially_verified', 'Partially Verified'
    
    schedule = models.ForeignKey(
        MedicationSchedule,
        on_delete=models.CASCADE,
        related_name='intakes'
    )
    scheduled_datetime = models.DateTimeField()
    verified_datetime = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )
    
    # Visual verification data
    medication_image = models.TextField(
        blank=True,
        help_text="Base64 encoded image of medication verification"
    )
    medication_detected = models.BooleanField(default=False)
    face_detected = models.BooleanField(default=False)
    position_verified = models.BooleanField(default=False)
    confidence_score = models.FloatField(null=True, blank=True)
    
    # AI analysis results
    ai_verification_result = models.JSONField(null=True, blank=True)
    
    notes = models.TextField(blank=True)
    
    # Escalation tracking
    reminder_sent = models.BooleanField(default=False)
    reminder_sent_at = models.DateTimeField(null=True, blank=True)
    escalation_sent = models.BooleanField(default=False)
    escalation_sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_datetime']
    
    def __str__(self):
        return f"{self.schedule.medication_name} - {self.scheduled_datetime.strftime('%Y-%m-%d %H:%M')} - {self.status}"
    
    def is_overdue(self):
        """Check if the intake is overdue for escalation."""
        if self.status != self.VerificationStatus.PENDING:
            return False
        
        escalation_deadline = self.scheduled_datetime + timedelta(
            minutes=self.schedule.verification_window_minutes
        )
        return timezone.now() > escalation_deadline


class SymptomCheckIn(models.Model):
    """Daily symptom check-in for patients."""
    
    class SeverityLevel(models.TextChoices):
        NONE = 'none', 'None'
        MILD = 'mild', 'Mild'
        MODERATE = 'moderate', 'Moderate'
        SEVERE = 'severe', 'Severe'
    
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='symptom_checkins'
    )
    check_in_date = models.DateField()
    
    # Common TB symptoms
    cough = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    fever = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    night_sweats = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    weight_loss = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    fatigue = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    chest_pain = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    
    # Treatment side effects
    nausea = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    appetite_loss = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    vision_problems = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    joint_pain = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.NONE)
    
    additional_notes = models.TextField(blank=True)
    
    # Risk assessment
    risk_score = models.FloatField(null=True, blank=True)
    requires_attention = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-check_in_date']
        unique_together = ['patient', 'check_in_date']
    
    def __str__(self):
        return f"{self.patient.username} - {self.check_in_date}"
    
    def calculate_risk_score(self):
        """Calculate risk score based on symptoms."""
        severity_scores = {
            'none': 0,
            'mild': 1,
            'moderate': 2,
            'severe': 3
        }
        
        # Weight different symptoms
        symptom_weights = {
            'cough': 1.2,
            'fever': 1.5,
            'night_sweats': 1.0,
            'weight_loss': 1.3,
            'fatigue': 0.8,
            'chest_pain': 1.5,
            'nausea': 1.0,
            'appetite_loss': 1.1,
            'vision_problems': 1.4,
            'joint_pain': 0.9,
        }
        
        total_score = 0
        for symptom, weight in symptom_weights.items():
            severity = getattr(self, symptom)
            total_score += severity_scores.get(severity, 0) * weight
        
        # Normalize to 0-100 scale
        max_possible_score = sum(symptom_weights.values()) * 3
        self.risk_score = (total_score / max_possible_score) * 100
        
        # Flag if risk is moderate or high
        self.requires_attention = self.risk_score > 30
        
        return self.risk_score


class MentalHealthCheckIn(models.Model):
    """Daily mental health and well-being check-in."""
    
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='mental_health_checkins'
    )
    check_in_date = models.DateField()
    
    # Mental health indicators (1-10 scale)
    mood_score = models.IntegerField(
        help_text="1=Very Poor, 10=Excellent",
        null=True,
        blank=True
    )
    stress_level = models.IntegerField(
        help_text="1=No Stress, 10=Extreme Stress",
        null=True,
        blank=True
    )
    motivation_level = models.IntegerField(
        help_text="1=No Motivation, 10=Very Motivated",
        null=True,
        blank=True
    )
    sleep_quality = models.IntegerField(
        help_text="1=Very Poor, 10=Excellent",
        null=True,
        blank=True
    )
    
    # Social support
    feeling_supported = models.BooleanField(null=True, blank=True)
    
    # Treatment burden
    treatment_burden = models.IntegerField(
        help_text="1=Not Burdensome, 10=Very Burdensome",
        null=True,
        blank=True
    )
    
    notes = models.TextField(blank=True)
    
    # Risk assessment
    disengagement_risk_score = models.FloatField(null=True, blank=True)
    requires_support = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-check_in_date']
        unique_together = ['patient', 'check_in_date']
    
    def __str__(self):
        return f"{self.patient.username} - Mental Health - {self.check_in_date}"
    
    def calculate_disengagement_risk(self):
        """Calculate risk of treatment disengagement."""
        # Inverted scoring (lower mood/motivation = higher risk)
        risk_factors = []
        
        if self.mood_score and self.mood_score <= 4:
            risk_factors.append(25)
        elif self.mood_score and self.mood_score <= 6:
            risk_factors.append(15)
        
        if self.stress_level and self.stress_level >= 7:
            risk_factors.append(20)
        elif self.stress_level and self.stress_level >= 5:
            risk_factors.append(10)
        
        if self.motivation_level and self.motivation_level <= 4:
            risk_factors.append(30)
        elif self.motivation_level and self.motivation_level <= 6:
            risk_factors.append(15)
        
        if self.treatment_burden and self.treatment_burden >= 7:
            risk_factors.append(20)
        
        if self.feeling_supported is False:
            risk_factors.append(15)
        
        self.disengagement_risk_score = sum(risk_factors)
        self.requires_support = self.disengagement_risk_score > 40
        
        return self.disengagement_risk_score


class Notification(models.Model):
    """System notifications for reminders and escalations."""
    
    class NotificationType(models.TextChoices):
        MEDICATION_REMINDER = 'medication_reminder', 'Medication Reminder'
        MISSED_DOSE = 'missed_dose', 'Missed Dose Alert'
        SYMPTOM_ALERT = 'symptom_alert', 'Symptom Alert'
        MENTAL_HEALTH_ALERT = 'mental_health_alert', 'Mental Health Alert'
        CHECKIN_REMINDER = 'checkin_reminder', 'Check-in Reminder'
    
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Related objects
    medication_intake = models.ForeignKey(
        MedicationIntake,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    
    is_read = models.BooleanField(default=False)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"{self.notification_type} - {self.recipient.username} - {self.sent_at}"


class SupportMessage(models.Model):
    """Encouraging and supportive messages for patients."""
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='support_messages'
    )
    message = models.TextField()
    message_type = models.CharField(max_length=50, default='encouragement')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Support for {self.patient.username} - {self.created_at}"

