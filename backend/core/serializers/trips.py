from rest_framework import serializers

from core.models.trips import Trip, TripActivity, TripStop


class TripActivitySerializer(serializers.ModelSerializer):
    activity_name = serializers.CharField(source='activity.name', read_only=True)

    class Meta:
        model = TripActivity
        fields = ['id', 'activity', 'activity_name', 'day', 'time']


class TripStopSerializer(serializers.ModelSerializer):
    activities = TripActivitySerializer(many=True, read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)
    country_name = serializers.CharField(source='city.country.name', read_only=True)

    class Meta:
        model = TripStop
        fields = ['id', 'city', 'city_name', 'country_name', 'start_date', 'end_date', 'position', 'activities']


class TripSerializer(serializers.ModelSerializer):
    stops = TripStopSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Trip
        fields = [
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'cover_image',
            'is_public',
            'share_uuid',
            'flight_data',
            'hotel_data',
            'destination_data',
            'attractions_data',
            'user',
            'user_name',
            'stops',
        ]
        read_only_fields = ['user', 'share_uuid']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TripCreateSerializer(serializers.ModelSerializer):
    """Serializer for trip creation from BuildItinerary page.

    Accepts some extra fields that the frontend may send (destination/budget/sections)
    and stores them into description for now.
    """

    destination = serializers.CharField(write_only=True, required=False, allow_blank=True)
    budget = serializers.CharField(write_only=True, required=False, allow_blank=True)
    sections = serializers.JSONField(write_only=True, required=False)

    class Meta:
        model = Trip
        fields = [
            'name',
            'description',
            'start_date',
            'end_date',
            'destination',
            'budget',
            'sections',
            'flight_data',
            'hotel_data',
            'destination_data',
            'attractions_data',
        ]

    def create(self, validated_data):
        destination = validated_data.pop('destination', '')
        budget = validated_data.pop('budget', '')
        sections = validated_data.pop('sections', None)

        description_parts = []
        if validated_data.get('description'):
            description_parts.append(validated_data['description'])
        if destination:
            description_parts.append(f"Destination: {destination}")
        if budget:
            description_parts.append(f"Budget: {budget}")
        if sections is not None:
            try:
                description_parts.append(f"Sections: {len(sections)}")
            except TypeError:
                description_parts.append("Sections: 1")

        validated_data['description'] = ' | '.join(description_parts)
        validated_data['user'] = self.context['request'].user

        return Trip.objects.create(**validated_data)


class TripListSerializer(serializers.ModelSerializer):
    stops_count = serializers.IntegerField(source='stops.count', read_only=True)

    class Meta:
        model = Trip
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'cover_image', 'is_public', 'stops_count']
