from django.contrib import admin
from .models import Habit, HabitLog


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ['name', 'habit_type', 'user', 'target_times_per_day', 'created_at']
    list_filter = ['habit_type', 'created_at']
    search_fields = ['name', 'description']


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ['habit', 'completed_at', 'notes']
    list_filter = ['completed_at']
    search_fields = ['notes']

