"""
API views for OrbiTB system.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q, Avg
from datetime import datetime, timedelta, time as datetime_time
import json

from .models import (
    UserProfile, MedicationSchedule, MedicationIntake,
    SymptomCheckIn, MentalHealthCheckIn, Notification, SupportMessage
)
from .serializers import (
    UserProfileSerializer, MedicationScheduleSerializer, MedicationIntakeSerializer,
    MedicationVerificationSerializer, SymptomCheckInSerializer, MentalHealthCheckInSerializer,
    NotificationSerializer, SupportMessageSerializer, AdherenceStatsSerializer,
    RiskAssessmentSerializer
)
from .cv_utils import process_verification_image, validate_image_format, generate_verification_feedback


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for user profiles."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get_queryset(self):
        """Get profile for current user or managed users."""
        user = self.request.user
        profile = getattr(user, 'profile', None)
        
        if not profile:
            return UserProfile.objects.none()
        
        # Patients see only their profile
        if profile.role == 'patient':
            return UserProfile.objects.filter(user=user)
        
        # Caregivers see their patients
        elif profile.role == 'caregiver':
            return UserProfile.objects.filter(
                Q(user=user) | Q(caregivers=profile)
            )
        
        # Healthcare workers see their managed patients
        elif profile.role == 'healthcare_worker':
            return UserProfile.objects.filter(
                Q(user=user) | Q(healthcare_workers=profile)
            )
        
        return UserProfile.objects.filter(user=user)


class MedicationScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet for medication schedules."""
    permission_classes = [IsAuthenticated]
    serializer_class = MedicationScheduleSerializer
    
    def get_queryset(self):
        """Get schedules for current user or managed patients."""
        user = self.request.user
        profile = getattr(user, 'profile', None)
        
        if not profile:
            return MedicationSchedule.objects.none()
        
        if profile.role == 'patient':
            return MedicationSchedule.objects.filter(patient=user)
        
        # Caregivers and healthcare workers see their patients' schedules
        elif profile.role in ['caregiver', 'healthcare_worker']:
            managed_patients = UserProfile.objects.filter(
                Q(caregivers=profile) | Q(healthcare_workers=profile)
            ).values_list('user_id', flat=True)
            return MedicationSchedule.objects.filter(patient_id__in=managed_patients)
        
        return MedicationSchedule.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        """Create schedule and generate intake records."""
        schedule = serializer.save()
        self._generate_intake_records(schedule)
    
    def _generate_intake_records(self, schedule):
        """Generate pending intake records for the schedule."""
        # Generate records for the next 7 days
        start_date = max(schedule.start_date, timezone.now().date())
        end_date = min(
            schedule.end_date,
            start_date + timedelta(days=7)
        )
        
        current_date = start_date
        while current_date <= end_date:
            for time_str in schedule.scheduled_times:
                # Parse time string (HH:MM)
                hour, minute = map(int, time_str.split(':'))
                scheduled_datetime = timezone.make_aware(
                    datetime.combine(current_date, datetime_time(hour, minute))
                )
                
                # Only create if in future
                if scheduled_datetime > timezone.now():
                    MedicationIntake.objects.create(
                        schedule=schedule,
                        scheduled_datetime=scheduled_datetime,
                        status='pending'
                    )
            
            current_date += timedelta(days=1)


class MedicationIntakeViewSet(viewsets.ModelViewSet):
    """ViewSet for medication intake records."""
    permission_classes = [IsAuthenticated]
    serializer_class = MedicationIntakeSerializer
    
    def get_queryset(self):
        """Get intake records for current user or managed patients."""
        user = self.request.user
        profile = getattr(user, 'profile', None)
        
        if not profile:
            return MedicationIntake.objects.none()
        
        if profile.role == 'patient':
            return MedicationIntake.objects.filter(schedule__patient=user)
        
        elif profile.role in ['caregiver', 'healthcare_worker']:
            managed_patients = UserProfile.objects.filter(
                Q(caregivers=profile) | Q(healthcare_workers=profile)
            ).values_list('user_id', flat=True)
            return MedicationIntake.objects.filter(schedule__patient_id__in=managed_patients)
        
        return MedicationIntake.objects.filter(schedule__patient=user)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending medication intakes for today."""
        today = timezone.now().date()
        queryset = self.get_queryset().filter(
            scheduled_datetime__date=today,
            status='pending'
        ).order_by('scheduled_datetime')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify medication intake with image."""
        intake = self.get_object()
        serializer = MedicationVerificationSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        image_base64 = serializer.validated_data['image_base64']
        notes = serializer.validated_data.get('notes', '')
        
        # Validate image format
        if not validate_image_format(image_base64):
            return Response(
                {'error': 'Invalid image format or size'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process with CV model
        verification_passed, cv_result = process_verification_image(image_base64)
        
        # Update intake record
        intake.medication_image = image_base64
        intake.medication_detected = cv_result.get('medication_detected', False)
        intake.face_detected = cv_result.get('face_detected', False)
        intake.position_verified = cv_result.get('position_verified', False)
        intake.confidence_score = cv_result.get('overall_confidence', 0.0)
        intake.ai_verification_result = cv_result
        intake.notes = notes
        intake.verified_datetime = timezone.now()
        
        if verification_passed:
            intake.status = 'verified'
        else:
            intake.status = 'partially_verified'
        
        intake.save()
        
        # Generate supportive message
        if verification_passed:
            SupportMessage.objects.create(
                patient=intake.schedule.patient,
                message="Great job! You've successfully taken your medication. Keep up the excellent work!",
                message_type='encouragement'
            )
        
        feedback = generate_verification_feedback(cv_result)
        
        return Response({
            'success': verification_passed,
            'intake': self.get_serializer(intake).data,
            'verification_result': cv_result,
            'feedback': feedback
        })
    
    @action(detail=False, methods=['get'])
    def adherence_stats(self, request):
        """Get adherence statistics for the current user."""
        user = request.user
        days = int(request.query_params.get('days', 30))
        
        cutoff_date = timezone.now() - timedelta(days=days)
        intakes = MedicationIntake.objects.filter(
            schedule__patient=user,
            scheduled_datetime__gte=cutoff_date
        )
        
        total_scheduled = intakes.count()
        total_verified = intakes.filter(status='verified').count()
        total_missed = intakes.filter(status='missed').count()
        
        adherence_rate = (total_verified / total_scheduled * 100) if total_scheduled > 0 else 0
        
        # Calculate current streak
        streak = 0
        current_date = timezone.now().date()
        while True:
            day_intakes = intakes.filter(scheduled_datetime__date=current_date)
            day_verified = day_intakes.filter(status='verified').count()
            day_total = day_intakes.count()
            
            if day_total > 0 and day_verified == day_total:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        # Last 7 days breakdown
        last_7_days = {}
        for i in range(7):
            date = (timezone.now() - timedelta(days=i)).date()
            day_intakes = intakes.filter(scheduled_datetime__date=date)
            day_verified = day_intakes.filter(status='verified').count()
            day_total = day_intakes.count()
            
            last_7_days[str(date)] = {
                'total': day_total,
                'verified': day_verified,
                'rate': (day_verified / day_total * 100) if day_total > 0 else 0
            }
        
        stats = {
            'total_scheduled': total_scheduled,
            'total_verified': total_verified,
            'total_missed': total_missed,
            'adherence_rate': round(adherence_rate, 2),
            'current_streak': streak,
            'last_7_days': last_7_days
        }
        
        serializer = AdherenceStatsSerializer(stats)
        return Response(serializer.data)


class SymptomCheckInViewSet(viewsets.ModelViewSet):
    """ViewSet for symptom check-ins."""
    permission_classes = [IsAuthenticated]
    serializer_class = SymptomCheckInSerializer
    
    def get_queryset(self):
        """Get check-ins for current user or managed patients."""
        user = self.request.user
        profile = getattr(user, 'profile', None)
        
        if not profile:
            return SymptomCheckIn.objects.none()
        
        if profile.role == 'patient':
            return SymptomCheckIn.objects.filter(patient=user)
        
        elif profile.role in ['caregiver', 'healthcare_worker']:
            managed_patients = UserProfile.objects.filter(
                Q(caregivers=profile) | Q(healthcare_workers=profile)
            ).values_list('user_id', flat=True)
            return SymptomCheckIn.objects.filter(patient_id__in=managed_patients)
        
        return SymptomCheckIn.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        """Create check-in and calculate risk score."""
        checkin = serializer.save()
        checkin.calculate_risk_score()
        checkin.save()
        
        # Send alert if requires attention
        if checkin.requires_attention:
            self._send_symptom_alert(checkin)
    
    def _send_symptom_alert(self, checkin):
        """Send alert for high-risk symptoms."""
        # Notify caregivers and healthcare workers
        patient_profile = checkin.patient.profile
        
        recipients = list(patient_profile.caregivers.all()) + list(patient_profile.healthcare_workers.all())
        
        for recipient_profile in recipients:
            Notification.objects.create(
                recipient=recipient_profile.user,
                notification_type='symptom_alert',
                title=f'Symptom Alert: {checkin.patient.username}',
                message=f'Patient {checkin.patient.username} has reported concerning symptoms with risk score {checkin.risk_score:.1f}. Please review.'
            )


class MentalHealthCheckInViewSet(viewsets.ModelViewSet):
    """ViewSet for mental health check-ins."""
    permission_classes = [IsAuthenticated]
    serializer_class = MentalHealthCheckInSerializer
    
    def get_queryset(self):
        """Get check-ins for current user or managed patients."""
        user = self.request.user
        profile = getattr(user, 'profile', None)
        
        if not profile:
            return MentalHealthCheckIn.objects.none()
        
        if profile.role == 'patient':
            return MentalHealthCheckIn.objects.filter(patient=user)
        
        elif profile.role in ['caregiver', 'healthcare_worker']:
            managed_patients = UserProfile.objects.filter(
                Q(caregivers=profile) | Q(healthcare_workers=profile)
            ).values_list('user_id', flat=True)
            return MentalHealthCheckIn.objects.filter(patient_id__in=managed_patients)
        
        return MentalHealthCheckIn.objects.filter(patient=user)
    
    def perform_create(self, serializer):
        """Create check-in and calculate risk score."""
        checkin = serializer.save()
        checkin.calculate_disengagement_risk()
        checkin.save()
        
        # Send alert if requires support
        if checkin.requires_support:
            self._send_mental_health_alert(checkin)
    
    def _send_mental_health_alert(self, checkin):
        """Send alert for high disengagement risk."""
        patient_profile = checkin.patient.profile
        
        recipients = list(patient_profile.caregivers.all()) + list(patient_profile.healthcare_workers.all())
        
        for recipient_profile in recipients:
            Notification.objects.create(
                recipient=recipient_profile.user,
                notification_type='mental_health_alert',
                title=f'Mental Health Alert: {checkin.patient.username}',
                message=f'Patient {checkin.patient.username} shows signs of potential disengagement (risk score: {checkin.disengagement_risk_score:.1f}). Consider reaching out for support.'
            )


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for notifications (read-only)."""
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        """Get notifications for current user."""
        return Notification.objects.filter(recipient=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})


class RiskAssessmentViewSet(viewsets.ViewSet):
    """ViewSet for risk assessment and patient monitoring."""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get risk assessment dashboard for healthcare workers."""
        user = request.user
        profile = getattr(user, 'profile', None)
        
        if not profile or profile.role != 'healthcare_worker':
            return Response(
                {'error': 'Only healthcare workers can access this dashboard'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get managed patients
        managed_patients = UserProfile.objects.filter(
            healthcare_workers=profile,
            role='patient'
        ).select_related('user')
        
        assessments = []
        
        for patient_profile in managed_patients:
            patient = patient_profile.user
            assessment = self._calculate_patient_risk(patient)
            assessments.append(assessment)
        
        # Sort by risk score (highest first)
        assessments.sort(key=lambda x: x['overall_risk_score'], reverse=True)
        
        serializer = RiskAssessmentSerializer(assessments, many=True)
        return Response(serializer.data)
    
    def _calculate_patient_risk(self, patient):
        """Calculate comprehensive risk assessment for a patient."""
        # Adherence risk
        recent_intakes = MedicationIntake.objects.filter(
            schedule__patient=patient,
            scheduled_datetime__gte=timezone.now() - timedelta(days=7)
        )
        total = recent_intakes.count()
        verified = recent_intakes.filter(status='verified').count()
        adherence_rate = (verified / total * 100) if total > 0 else 0
        adherence_risk = 100 - adherence_rate
        
        # Symptom risk
        recent_symptoms = SymptomCheckIn.objects.filter(
            patient=patient,
            check_in_date__gte=timezone.now().date() - timedelta(days=7)
        ).order_by('-check_in_date').first()
        symptom_risk = recent_symptoms.risk_score if recent_symptoms else 0
        
        # Mental health risk
        recent_mh = MentalHealthCheckIn.objects.filter(
            patient=patient,
            check_in_date__gte=timezone.now().date() - timedelta(days=7)
        ).order_by('-check_in_date').first()
        mental_health_risk = recent_mh.disengagement_risk_score if recent_mh else 0
        
        # Overall risk (weighted average)
        overall_risk = (
            adherence_risk * 0.4 +
            symptom_risk * 0.3 +
            mental_health_risk * 0.3
        )
        
        # Determine risk level
        if overall_risk >= 60:
            risk_level = 'high'
        elif overall_risk >= 30:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        # Generate recommendations
        recommendations = []
        if adherence_risk > 30:
            recommendations.append('Review medication adherence with patient')
        if symptom_risk > 30:
            recommendations.append('Evaluate symptoms and possible side effects')
        if mental_health_risk > 40:
            recommendations.append('Provide additional mental health support')
        
        return {
            'patient_id': patient.id,
            'patient_name': patient.username,
            'overall_risk_score': round(overall_risk, 2),
            'adherence_risk': round(adherence_risk, 2),
            'symptom_risk': round(symptom_risk, 2),
            'mental_health_risk': round(mental_health_risk, 2),
            'risk_level': risk_level,
            'requires_intervention': overall_risk >= 60,
            'recommendations': recommendations
        }
