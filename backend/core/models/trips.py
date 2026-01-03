import uuid
from django.db import models
from django.conf import settings
from .locations import City
from .activities import Activity

class Trip(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='trips')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    cover_image = models.ImageField(upload_to='trip_covers/', null=True, blank=True)
    is_public = models.BooleanField(default=False)
    share_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.name

class TripStop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ['position']

    def __str__(self):
        return f"{self.city.name} in {self.trip.name}"

class TripActivity(models.Model):
    trip_stop = models.ForeignKey(TripStop, on_delete=models.CASCADE, related_name='activities')
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    day = models.IntegerField(help_text="Day number relative to trip stop start")
    time = models.TimeField()

    class Meta:
        ordering = ['day', 'time']
        verbose_name_plural = "Trip Activities"

    def __str__(self):
        return f"{self.activity.name} on Day {self.day} at {self.time}"
