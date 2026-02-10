"""
Serializers for the habits API.
"""
from rest_framework import serializers
from .models import Habit, HabitLog


class HabitLogSerializer(serializers.ModelSerializer):
    """Serializer for habit logs."""
    
    class Meta:
        model = HabitLog
        fields = ['id', 'habit', 'completed_at', 'notes']
        read_only_fields = ['id', 'completed_at']


class HabitSerializer(serializers.ModelSerializer):
    """Serializer for habits."""
    logs_today_count = serializers.SerializerMethodField()
    disruption = serializers.SerializerMethodField()
    
    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'habit_type', 'target_times_per_day',
            'description', 'created_at', 'updated_at',
            'logs_today_count', 'disruption'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_logs_today_count(self, obj):
        """Get count of logs for today."""
        return obj.get_logs_today().count()
    
    def get_disruption(self, obj):
        """Get disruption status for this habit."""
        return obj.check_disruption()


class HabitDetailSerializer(HabitSerializer):
    """Detailed serializer for habits including recent logs."""
    recent_logs = serializers.SerializerMethodField()
    
    class Meta(HabitSerializer.Meta):
        fields = HabitSerializer.Meta.fields + ['recent_logs']
    
    def get_recent_logs(self, obj):
        """Get recent logs for this habit."""
        logs = obj.logs.all()[:10]
        return HabitLogSerializer(logs, many=True).data


class DisruptionSerializer(serializers.Serializer):
    """Serializer for disruption alerts."""
    habit_id = serializers.IntegerField()
    habit_name = serializers.CharField()
    severity = serializers.CharField()
    message = serializers.CharField()
