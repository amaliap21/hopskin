"""
Habit tracker to manage and monitor habits.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Dict
import json
import os

from .models import Habit, HabitLog, HabitType, HabitFrequency, HabitDisruption


class HabitTracker:
    """Main class for tracking habits and detecting disruptions."""
    
    def __init__(self, data_file: str = "habits_data.json"):
        self.data_file = data_file
        self.habits: Dict[int, Habit] = {}
        self.logs: List[HabitLog] = []
        self.next_habit_id = 1
        self.load_data()
    
    def add_habit(self, habit: Habit) -> Habit:
        """Add a new habit to track."""
        habit.id = self.next_habit_id
        self.habits[habit.id] = habit
        self.next_habit_id += 1
        self.save_data()
        return habit
    
    def log_habit(self, habit_id: int, completed_at: Optional[datetime] = None,
                  notes: str = "") -> HabitLog:
        """Log completion of a habit."""
        if habit_id not in self.habits:
            raise ValueError(f"Habit with id {habit_id} not found")
        
        log = HabitLog(habit_id, completed_at, notes)
        self.logs.append(log)
        self.save_data()
        return log
    
    def get_habit_logs(self, habit_id: int, 
                       days_back: int = 7) -> List[HabitLog]:
        """Get logs for a specific habit within a time period."""
        cutoff_date = datetime.now() - timedelta(days=days_back)
        return [
            log for log in self.logs 
            if log.habit_id == habit_id and log.completed_at >= cutoff_date
        ]
    
    def check_disruptions(self) -> List[HabitDisruption]:
        """Check for disruptions in habit maintenance."""
        disruptions = []
        now = datetime.now()
        
        for habit_id, habit in self.habits.items():
            # Get logs from the last 2 days
            recent_logs = self.get_habit_logs(habit_id, days_back=2)
            today_logs = [
                log for log in recent_logs 
                if log.completed_at.date() == now.date()
            ]
            yesterday_logs = [
                log for log in recent_logs 
                if log.completed_at.date() == (now - timedelta(days=1)).date()
            ]
            
            # Check if habit was not done today
            if len(today_logs) == 0:
                # Check if habit was created today - if so, don't flag yesterday
                habit_created_today = habit.created_at.date() == now.date()
                
                if len(yesterday_logs) == 0 and not habit_created_today:
                    # Not done yesterday either - high severity
                    disruptions.append(HabitDisruption(
                        habit,
                        "missed_multiple_days",
                        f"You haven't logged '{habit.name}' for 2+ days",
                        "high"
                    ))
                else:
                    # Only today - medium severity
                    disruptions.append(HabitDisruption(
                        habit,
                        "missed_today",
                        f"You haven't logged '{habit.name}' today yet",
                        "medium"
                    ))
            # Check if habit was done less than target times
            elif len(today_logs) < habit.target_times_per_day:
                disruptions.append(HabitDisruption(
                    habit,
                    "incomplete",
                    f"You've only logged '{habit.name}' {len(today_logs)}/{habit.target_times_per_day} times today",
                    "low"
                ))
        
        return disruptions
    
    def get_support_messages(self) -> List[str]:
        """Get timely support messages based on detected disruptions."""
        disruptions = self.check_disruptions()
        messages = []
        
        if not disruptions:
            messages.append("Great job! All your habits are on track!")
            return messages
        
        # Group by severity
        high_priority = [d for d in disruptions if d.severity == "high"]
        medium_priority = [d for d in disruptions if d.severity == "medium"]
        low_priority = [d for d in disruptions if d.severity == "low"]
        
        if high_priority:
            messages.append("⚠️  URGENT: Some habits need immediate attention!")
            for disruption in high_priority:
                messages.append(f"  • {disruption.message}")
        
        if medium_priority:
            messages.append("⚡ REMINDER: Don't forget these habits today!")
            for disruption in medium_priority:
                messages.append(f"  • {disruption.message}")
        
        if low_priority:
            messages.append("📝 Note: You're making progress, but there's room for improvement:")
            for disruption in low_priority:
                messages.append(f"  • {disruption.message}")
        
        return messages
    
    def get_habit_statistics(self, habit_id: int, days: int = 7) -> dict:
        """Get statistics for a habit over a period."""
        logs = self.get_habit_logs(habit_id, days_back=days)
        habit = self.habits.get(habit_id)
        
        if not habit:
            return {}
        
        # Calculate completion rate
        expected_completions = days * habit.target_times_per_day
        actual_completions = len(logs)
        completion_rate = (actual_completions / expected_completions * 100) if expected_completions > 0 else 0
        
        # Calculate streak (consecutive days with completions)
        streak = 0
        current_date = datetime.now().date()
        # Check backwards from today, but limit to the tracking period and habit creation date
        earliest_date = max(
            habit.created_at.date(),
            (datetime.now() - timedelta(days=days)).date()
        )
        
        while current_date >= earliest_date:
            day_logs = [
                log for log in logs 
                if log.completed_at.date() == current_date
            ]
            if len(day_logs) >= habit.target_times_per_day:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        return {
            'habit_name': habit.name,
            'days_tracked': days,
            'expected_completions': expected_completions,
            'actual_completions': actual_completions,
            'completion_rate': round(completion_rate, 2),
            'current_streak': streak,
        }
    
    def save_data(self):
        """Save habits and logs to file."""
        data = {
            'next_habit_id': self.next_habit_id,
            'habits': [habit.to_dict() for habit in self.habits.values()],
            'logs': [log.to_dict() for log in self.logs],
        }
        with open(self.data_file, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load_data(self):
        """Load habits and logs from file."""
        if not os.path.exists(self.data_file):
            return
        
        try:
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            self.next_habit_id = data.get('next_habit_id', 1)
            
            # Load habits
            for habit_dict in data.get('habits', []):
                habit = Habit.from_dict(habit_dict)
                self.habits[habit.id] = habit
            
            # Load logs
            for log_dict in data.get('logs', []):
                log = HabitLog.from_dict(log_dict)
                self.logs.append(log)
        
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Warning: Could not load data from {self.data_file}: {e}")
