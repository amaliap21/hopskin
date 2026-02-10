# HopSkin - Daily Habit Maintenance System

HopSkin is a digital system that helps you maintain your daily habits and provides timely support when those habits start to be disrupted.

## Features

- **Track Multiple Habit Types:**
  - 💊 Medication reminders
  - 🏃 Movement/Exercise tracking
  - 😴 Rest/Sleep monitoring
  - 🩺 Self-checking routines

- **Smart Disruption Detection:**
  - Automatically detects when habits are missed
  - Provides severity-based alerts (high, medium, low)
  - Offers timely support messages to get back on track

- **Progress Tracking:**
  - View completion rates and statistics
  - Track consecutive day streaks
  - Monitor habit adherence over time

## Installation

1. Clone the repository:
```bash
git clone https://github.com/amaliap21/hopskin.git
cd hopskin
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the application:
```bash
python main.py
```

### Main Menu Options

1. **Add a new habit** - Create a new habit to track
2. **Log a habit completion** - Record that you've completed a habit
3. **View all habits** - See all your tracked habits
4. **Check for disruptions** - Get alerts about missed or incomplete habits
5. **View habit statistics** - See detailed stats for a specific habit
6. **Exit** - Close the application

### Example Workflow

1. Add a habit: "Take morning medication" (Medication type, 1x per day)
2. Log completion when you take your medication
3. Check for disruptions to see if you've missed any habits
4. View statistics to see your adherence rate

## How It Works

### Disruption Detection

The system checks for three types of disruptions:

- **High Priority**: Habit not logged for 2+ days
- **Medium Priority**: Habit not logged today
- **Low Priority**: Habit logged but not enough times (e.g., 1/2 times)

### Data Storage

All data is stored locally in `habits_data.json` in the current directory.

## Requirements

- Python 3.7+
- python-dateutil

## License

MIT License