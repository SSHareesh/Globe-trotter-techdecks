from django.contrib import admin
from core.models import City, Activity, Trip, TripStop, TripActivity

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'cost_index', 'popularity_score')
    search_fields = ('name', 'country')

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'cost', 'duration')
    search_fields = ('name', 'category')
    list_filter = ('category',)

class TripStopInline(admin.TabularInline):
    model = TripStop
    extra = 1

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'start_date', 'end_date', 'is_public')
    list_filter = ('is_public', 'start_date')
    search_fields = ('name', 'user__email')
    inlines = [TripStopInline]

class TripActivityInline(admin.TabularInline):
    model = TripActivity
    extra = 1

@admin.register(TripStop)
class TripStopAdmin(admin.ModelAdmin):
    list_display = ('trip', 'city', 'start_date', 'end_date', 'position')
    list_filter = ('trip', 'city')
    inlines = [TripActivityInline]

@admin.register(TripActivity)
class TripActivityAdmin(admin.ModelAdmin):
    list_display = ('trip_stop', 'activity', 'day', 'time')
