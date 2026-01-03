from django.db import models

class City(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    cost_index = models.FloatField(help_text="Cost index of the city")
    popularity_score = models.FloatField(help_text="Popularity score of the city")

    def __str__(self):
        return f"{self.name}, {self.country}"

    class Meta:
        verbose_name_plural = "Cities"
