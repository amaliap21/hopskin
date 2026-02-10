"""
Command-line interface for HopSkin habit tracker.
"""
import sys
from datetime import datetime
from .models import Habit, HabitType, HabitFrequency
from .tracker import HabitTracker


def display_menu():
    """Display the main menu."""
    print("\n" + "="*50)
    print("HopSkin - Daily Habit Maintenance System")
    print("="*50)
    print("1. Add a new habit")
    print("2. Log a habit completion")
    print("3. View all habits")
    print("4. Check for disruptions")
    print("5. View habit statistics")
    print("6. Exit")
    print("="*50)


def add_habit(tracker: HabitTracker):
    """Interactive flow to add a new habit."""
    print("\n--- Add New Habit ---")
    name = input("Habit name: ").strip()
    
    print("\nSelect habit type:")
    print("1. Medication")
    print("2. Moving/Exercise")
    print("3. Resting/Sleep")
    print("4. Self-checking")
    
    type_choice = input("Choice (1-4): ").strip()
    type_map = {
        '1': HabitType.MEDICATION,
        '2': HabitType.MOVING,
        '3': HabitType.RESTING,
        '4': HabitType.SELF_CHECKING,
    }
    habit_type = type_map.get(type_choice, HabitType.MEDICATION)
    
    target_times = input("How many times per day? (default: 1): ").strip()
    target_times = int(target_times) if target_times else 1
    
    description = input("Description (optional): ").strip()
    
    habit = Habit(
        name=name,
        habit_type=habit_type,
        target_times_per_day=target_times,
        description=description
    )
    
    tracker.add_habit(habit)
    print(f"\n✓ Habit '{name}' added successfully! (ID: {habit.id})")


def log_habit_completion(tracker: HabitTracker):
    """Interactive flow to log a habit completion."""
    print("\n--- Log Habit Completion ---")
    
    if not tracker.habits:
        print("No habits found. Add a habit first!")
        return
    
    print("\nYour habits:")
    for habit_id, habit in tracker.habits.items():
        print(f"  {habit_id}. {habit.name} ({habit.habit_type.value})")
    
    habit_id = input("\nEnter habit ID to log: ").strip()
    try:
        habit_id = int(habit_id)
        if habit_id not in tracker.habits:
            print("Invalid habit ID!")
            return
    except ValueError:
        print("Invalid input!")
        return
    
    notes = input("Add notes (optional): ").strip()
    
    tracker.log_habit(habit_id, notes=notes)
    print(f"\n✓ Logged '{tracker.habits[habit_id].name}' successfully!")


def view_all_habits(tracker: HabitTracker):
    """Display all habits."""
    print("\n--- All Habits ---")
    
    if not tracker.habits:
        print("No habits found.")
        return
    
    for habit_id, habit in tracker.habits.items():
        logs_today = len([
            log for log in tracker.logs 
            if log.habit_id == habit_id and 
            log.completed_at.date() == datetime.now().date()
        ])
        
        print(f"\nID: {habit_id}")
        print(f"Name: {habit.name}")
        print(f"Type: {habit.habit_type.value}")
        print(f"Target: {habit.target_times_per_day}x per day")
        print(f"Logged today: {logs_today}/{habit.target_times_per_day}")
        if habit.description:
            print(f"Description: {habit.description}")


def check_disruptions(tracker: HabitTracker):
    """Check and display habit disruptions."""
    print("\n--- Habit Status Check ---")
    messages = tracker.get_support_messages()
    
    for message in messages:
        print(message)


def view_statistics(tracker: HabitTracker):
    """View statistics for a specific habit."""
    print("\n--- View Habit Statistics ---")
    
    if not tracker.habits:
        print("No habits found.")
        return
    
    print("\nYour habits:")
    for habit_id, habit in tracker.habits.items():
        print(f"  {habit_id}. {habit.name}")
    
    habit_id = input("\nEnter habit ID: ").strip()
    try:
        habit_id = int(habit_id)
        if habit_id not in tracker.habits:
            print("Invalid habit ID!")
            return
    except ValueError:
        print("Invalid input!")
        return
    
    days = input("How many days to analyze? (default: 7): ").strip()
    days = int(days) if days else 7
    
    stats = tracker.get_habit_statistics(habit_id, days)
    
    print(f"\n--- Statistics for '{stats['habit_name']}' ---")
    print(f"Period: Last {stats['days_tracked']} days")
    print(f"Expected completions: {stats['expected_completions']}")
    print(f"Actual completions: {stats['actual_completions']}")
    print(f"Completion rate: {stats['completion_rate']}%")
    print(f"Current streak: {stats['current_streak']} days")


def main():
    """Main entry point for the CLI."""
    tracker = HabitTracker()
    
    print("\nWelcome to HopSkin!")
    print("Maintaining your daily habits for better health.")
    
    while True:
        display_menu()
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == '1':
            add_habit(tracker)
        elif choice == '2':
            log_habit_completion(tracker)
        elif choice == '3':
            view_all_habits(tracker)
        elif choice == '4':
            check_disruptions(tracker)
        elif choice == '5':
            view_statistics(tracker)
        elif choice == '6':
            print("\nThank you for using HopSkin. Stay healthy!")
            sys.exit(0)
        else:
            print("\nInvalid choice. Please try again.")


if __name__ == "__main__":
    main()
