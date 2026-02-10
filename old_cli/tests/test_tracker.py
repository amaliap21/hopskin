"""
Unit tests for habit tracker functionality.
"""
import unittest
import os
import tempfile
from datetime import datetime, timedelta

from hopskin.models import Habit, HabitType, HabitFrequency, HabitLog
from hopskin.tracker import HabitTracker


class TestHabit(unittest.TestCase):
    """Test Habit model."""
    
    def test_create_habit(self):
        """Test creating a habit."""
        habit = Habit(
            name="Take vitamins",
            habit_type=HabitType.MEDICATION,
            target_times_per_day=1
        )
        self.assertEqual(habit.name, "Take vitamins")
        self.assertEqual(habit.habit_type, HabitType.MEDICATION)
        self.assertEqual(habit.target_times_per_day, 1)
    
    def test_habit_serialization(self):
        """Test habit to/from dict conversion."""
        habit = Habit(
            name="Morning run",
            habit_type=HabitType.MOVING,
            target_times_per_day=1,
            description="30 minute run"
        )
        habit.id = 1
        
        # Convert to dict
        habit_dict = habit.to_dict()
        self.assertEqual(habit_dict['name'], "Morning run")
        self.assertEqual(habit_dict['habit_type'], "moving")
        
        # Convert back from dict
        habit2 = Habit.from_dict(habit_dict)
        self.assertEqual(habit2.name, habit.name)
        self.assertEqual(habit2.habit_type, habit.habit_type)


class TestHabitLog(unittest.TestCase):
    """Test HabitLog model."""
    
    def test_create_log(self):
        """Test creating a habit log."""
        log = HabitLog(habit_id=1, notes="Felt good")
        self.assertEqual(log.habit_id, 1)
        self.assertEqual(log.notes, "Felt good")
        self.assertIsInstance(log.completed_at, datetime)
    
    def test_log_serialization(self):
        """Test log to/from dict conversion."""
        log = HabitLog(habit_id=1, notes="Test note")
        log_dict = log.to_dict()
        
        log2 = HabitLog.from_dict(log_dict)
        self.assertEqual(log2.habit_id, log.habit_id)
        self.assertEqual(log2.notes, log.notes)


class TestHabitTracker(unittest.TestCase):
    """Test HabitTracker functionality."""
    
    def setUp(self):
        """Set up test tracker with temporary file."""
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.json')
        self.temp_file.close()
        self.tracker = HabitTracker(data_file=self.temp_file.name)
    
    def tearDown(self):
        """Clean up temporary file."""
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)
    
    def test_add_habit(self):
        """Test adding a habit."""
        habit = Habit(
            name="Take medication",
            habit_type=HabitType.MEDICATION
        )
        added_habit = self.tracker.add_habit(habit)
        
        self.assertIsNotNone(added_habit.id)
        self.assertIn(added_habit.id, self.tracker.habits)
    
    def test_log_habit(self):
        """Test logging a habit completion."""
        habit = Habit(
            name="Exercise",
            habit_type=HabitType.MOVING
        )
        added_habit = self.tracker.add_habit(habit)
        
        log = self.tracker.log_habit(added_habit.id, notes="Good workout")
        self.assertEqual(log.habit_id, added_habit.id)
        self.assertEqual(log.notes, "Good workout")
        self.assertEqual(len(self.tracker.logs), 1)
    
    def test_get_habit_logs(self):
        """Test retrieving habit logs."""
        habit = Habit(
            name="Sleep tracking",
            habit_type=HabitType.RESTING
        )
        added_habit = self.tracker.add_habit(habit)
        
        # Add some logs
        self.tracker.log_habit(added_habit.id)
        self.tracker.log_habit(added_habit.id)
        
        logs = self.tracker.get_habit_logs(added_habit.id, days_back=1)
        self.assertEqual(len(logs), 2)
    
    def test_disruption_detection_missed_today(self):
        """Test disruption detection when habit is missed today."""
        habit = Habit(
            name="Daily vitamin",
            habit_type=HabitType.MEDICATION
        )
        self.tracker.add_habit(habit)
        
        disruptions = self.tracker.check_disruptions()
        self.assertEqual(len(disruptions), 1)
        self.assertEqual(disruptions[0].severity, "medium")
    
    def test_disruption_detection_completed(self):
        """Test no disruption when habit is completed."""
        habit = Habit(
            name="Daily walk",
            habit_type=HabitType.MOVING
        )
        added_habit = self.tracker.add_habit(habit)
        self.tracker.log_habit(added_habit.id)
        
        disruptions = self.tracker.check_disruptions()
        self.assertEqual(len(disruptions), 0)
    
    def test_disruption_detection_incomplete(self):
        """Test disruption when habit is incomplete."""
        habit = Habit(
            name="Take medication",
            habit_type=HabitType.MEDICATION,
            target_times_per_day=2
        )
        added_habit = self.tracker.add_habit(habit)
        self.tracker.log_habit(added_habit.id)  # Only logged once
        
        disruptions = self.tracker.check_disruptions()
        self.assertEqual(len(disruptions), 1)
        self.assertEqual(disruptions[0].severity, "low")
    
    def test_support_messages(self):
        """Test support message generation."""
        habit = Habit(
            name="Exercise",
            habit_type=HabitType.MOVING
        )
        added_habit = self.tracker.add_habit(habit)
        self.tracker.log_habit(added_habit.id)
        
        messages = self.tracker.get_support_messages()
        self.assertGreater(len(messages), 0)
        self.assertIn("track", messages[0].lower())
    
    def test_habit_statistics(self):
        """Test habit statistics calculation."""
        habit = Habit(
            name="Daily meditation",
            habit_type=HabitType.SELF_CHECKING,
            target_times_per_day=1
        )
        added_habit = self.tracker.add_habit(habit)
        
        # Log for today
        self.tracker.log_habit(added_habit.id)
        
        stats = self.tracker.get_habit_statistics(added_habit.id, days=1)
        self.assertEqual(stats['habit_name'], "Daily meditation")
        self.assertEqual(stats['actual_completions'], 1)
        self.assertEqual(stats['current_streak'], 1)
    
    def test_data_persistence(self):
        """Test saving and loading data."""
        habit = Habit(
            name="Test habit",
            habit_type=HabitType.MEDICATION
        )
        added_habit = self.tracker.add_habit(habit)
        self.tracker.log_habit(added_habit.id)
        
        # Create new tracker instance with same file
        tracker2 = HabitTracker(data_file=self.temp_file.name)
        
        # Verify data was loaded
        self.assertEqual(len(tracker2.habits), 1)
        self.assertEqual(len(tracker2.logs), 1)
        self.assertIn(added_habit.id, tracker2.habits)


if __name__ == '__main__':
    unittest.main()
