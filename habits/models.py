"""
Django models for habit tracking.
"""
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta


class HabitType(models.TextChoices):
    """Types of habits that can be tracked."""
    MEDICATION = 'medication', 'Medication'
    MOVING = 'moving', 'Moving/Exercise'
    RESTING = 'resting', 'Resting/Sleep'
    SELF_CHECKING = 'self_checking', 'Self-checking'


class Habit(models.Model):
    """Represents a habit to be tracked."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    name = models.CharField(max_length=200)
    habit_type = models.CharField(
        max_length=20,
        choices=HabitType.choices,
        default=HabitType.MEDICATION
    )
    target_times_per_day = models.IntegerField(default=1)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.habit_type})"
    
    def get_logs_today(self):
        """Get logs for today."""
        today = datetime.now().date()
        return self.logs.filter(completed_at__date=today)
    
    def get_logs_yesterday(self):
        """Get logs for yesterday."""
        yesterday = (datetime.now() - timedelta(days=1)).date()
        return self.logs.filter(completed_at__date=yesterday)
    
    def check_disruption(self):
        """Check if this habit has a disruption."""
        logs_today = self.get_logs_today()
        logs_yesterday = self.get_logs_yesterday()
        
        if logs_today.count() == 0:
            habit_created_today = self.created_at.date() == datetime.now().date()
            
            if logs_yesterday.count() == 0 and not habit_created_today:
                return {
                    'has_disruption': True,
                    'severity': 'high',
                    'message': f"You haven't logged '{self.name}' for 2+ days"
                }
            else:
                return {
                    'has_disruption': True,
                    'severity': 'medium',
                    'message': f"You haven't logged '{self.name}' today yet"
                }
        elif logs_today.count() < self.target_times_per_day:
            return {
                'has_disruption': True,
                'severity': 'low',
                'message': f"You've only logged '{self.name}' {logs_today.count()}/{self.target_times_per_day} times today"
            }
        
        return {'has_disruption': False}


class HabitLog(models.Model):
    """Represents a single execution/completion of a habit."""
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    completed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.habit.name} - {self.completed_at.strftime('%Y-%m-%d %H:%M')}"

