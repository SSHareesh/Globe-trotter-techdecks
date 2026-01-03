from django.db import models

class Activity(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    cost = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost of the activity")
    duration = models.IntegerField(help_text="Duration in minutes")
    image_url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Activities"
