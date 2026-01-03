from rest_framework import serializers

from core.models import Activity, City


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'country']


class ActivityListSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'name', 'category', 'description', 'cost', 'duration', 'rating', 'image_url', 'city']
