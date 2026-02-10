"""
API views for habit tracking.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from datetime import datetime, timedelta

from .models import Habit, HabitLog
from .serializers import (
    HabitSerializer, HabitDetailSerializer,
    HabitLogSerializer, DisruptionSerializer
)


class HabitViewSet(viewsets.ModelViewSet):
    """ViewSet for managing habits."""
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get habits for the current user."""
        return Habit.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer class."""
        if self.action == 'retrieve':
            return HabitDetailSerializer
        return HabitSerializer
    
    def perform_create(self, serializer):
        """Create a habit for the current user."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def disruptions(self, request):
        """Get all disruptions for the user's habits."""
        habits = self.get_queryset()
        disruptions = []
        
        for habit in habits:
            disruption = habit.check_disruption()
            if disruption['has_disruption']:
                disruptions.append({
                    'habit_id': habit.id,
                    'habit_name': habit.name,
                    'severity': disruption['severity'],
                    'message': disruption['message']
                })
        
        # Sort by severity (high -> medium -> low)
        severity_order = {'high': 0, 'medium': 1, 'low': 2}
        disruptions.sort(key=lambda x: severity_order.get(x['severity'], 3))
        
        serializer = DisruptionSerializer(disruptions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def support_messages(self, request):
        """Get support messages based on disruptions."""
        habits = self.get_queryset()
        disruptions = []
        
        for habit in habits:
            disruption = habit.check_disruption()
            if disruption['has_disruption']:
                disruptions.append(disruption)
        
        messages = []
        
        if not disruptions:
            messages.append("Great job! All your habits are on track!")
            return Response({'messages': messages})
        
        # Group by severity
        high_priority = [d for d in disruptions if d['severity'] == 'high']
        medium_priority = [d for d in disruptions if d['severity'] == 'medium']
        low_priority = [d for d in disruptions if d['severity'] == 'low']
        
        if high_priority:
            messages.append("⚠️  URGENT: Some habits need immediate attention!")
            for disruption in high_priority:
                messages.append(f"  • {disruption['message']}")
        
        if medium_priority:
            messages.append("⚡ REMINDER: Don't forget these habits today!")
            for disruption in medium_priority:
                messages.append(f"  • {disruption['message']}")
        
        if low_priority:
            messages.append("📝 Note: You're making progress, but there's room for improvement:")
            for disruption in low_priority:
                messages.append(f"  • {disruption['message']}")
        
        return Response({'messages': messages})
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get statistics for a specific habit."""
        habit = self.get_object()
        days = int(request.query_params.get('days', 7))
        
        # Get logs within the time period
        cutoff_date = datetime.now() - timedelta(days=days)
        logs = habit.logs.filter(completed_at__gte=cutoff_date)
        
        # Calculate stats
        expected_completions = days * habit.target_times_per_day
        actual_completions = logs.count()
        completion_rate = (actual_completions / expected_completions * 100) if expected_completions > 0 else 0
        
        # Calculate streak
        streak = 0
        current_date = datetime.now().date()
        earliest_date = max(
            habit.created_at.date(),
            (datetime.now() - timedelta(days=days)).date()
        )
        
        while current_date >= earliest_date:
            day_logs = logs.filter(completed_at__date=current_date)
            if day_logs.count() >= habit.target_times_per_day:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        return Response({
            'habit_name': habit.name,
            'days_tracked': days,
            'expected_completions': expected_completions,
            'actual_completions': actual_completions,
            'completion_rate': round(completion_rate, 2),
            'current_streak': streak,
        })


class HabitLogViewSet(viewsets.ModelViewSet):
    """ViewSet for managing habit logs."""
    permission_classes = [IsAuthenticated]
    serializer_class = HabitLogSerializer
    
    def get_queryset(self):
        """Get logs for the current user's habits."""
        return HabitLog.objects.filter(habit__user=self.request.user)
    
    def perform_create(self, serializer):
        """Create a log ensuring it belongs to the user's habit."""
        habit_id = self.request.data.get('habit')
        try:
            habit = Habit.objects.get(id=habit_id, user=self.request.user)
            serializer.save(habit=habit)
        except Habit.DoesNotExist:
            raise serializers.ValidationError("Habit not found or doesn't belong to you")

