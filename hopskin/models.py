"""
Core models for the habit tracking system.
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional, Dict
import json


class HabitType(Enum):
    """Types of habits that can be tracked."""
    MEDICATION = "medication"
    MOVING = "moving"
    RESTING = "resting"
    SELF_CHECKING = "self_checking"


class HabitFrequency(Enum):
    """Frequency of habit execution."""
    DAILY = "daily"
    WEEKLY = "weekly"
    CUSTOM = "custom"


class Habit:
    """Represents a habit to be tracked."""
    
    def __init__(self, name: str, habit_type: HabitType, 
                 frequency: HabitFrequency = HabitFrequency.DAILY,
                 target_times_per_day: int = 1,
                 description: str = ""):
        self.id = None  # Will be set by the tracker
        self.name = name
        self.habit_type = habit_type
        self.frequency = frequency
        self.target_times_per_day = target_times_per_day
        self.description = description
        self.created_at = datetime.now()
        self.logs: List['HabitLog'] = []
    
    def to_dict(self) -> dict:
        """Convert habit to dictionary for serialization."""
        return {
            'id': self.id,
            'name': self.name,
            'habit_type': self.habit_type.value,
            'frequency': self.frequency.value,
            'target_times_per_day': self.target_times_per_day,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Habit':
        """Create habit from dictionary."""
        habit = cls(
            name=data['name'],
            habit_type=HabitType(data['habit_type']),
            frequency=HabitFrequency(data['frequency']),
            target_times_per_day=data['target_times_per_day'],
            description=data.get('description', '')
        )
        habit.id = data.get('id')
        habit.created_at = datetime.fromisoformat(data['created_at'])
        return habit


class HabitLog:
    """Represents a single execution/completion of a habit."""
    
    def __init__(self, habit_id: int, completed_at: Optional[datetime] = None,
                 notes: str = ""):
        self.habit_id = habit_id
        self.completed_at = completed_at or datetime.now()
        self.notes = notes
    
    def to_dict(self) -> dict:
        """Convert log to dictionary for serialization."""
        return {
            'habit_id': self.habit_id,
            'completed_at': self.completed_at.isoformat(),
            'notes': self.notes,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'HabitLog':
        """Create log from dictionary."""
        return cls(
            habit_id=data['habit_id'],
            completed_at=datetime.fromisoformat(data['completed_at']),
            notes=data.get('notes', '')
        )


class HabitDisruption:
    """Represents a detected disruption in habit maintenance."""
    
    def __init__(self, habit: Habit, disruption_type: str, 
                 message: str, severity: str = "medium"):
        self.habit = habit
        self.disruption_type = disruption_type
        self.message = message
        self.severity = severity  # low, medium, high
        self.detected_at = datetime.now()
    
    def __str__(self) -> str:
        return f"[{self.severity.upper()}] {self.habit.name}: {self.message}"
