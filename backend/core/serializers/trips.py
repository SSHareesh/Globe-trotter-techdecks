from rest_framework import serializers
from core.models.trips import Trip, TripStop, TripActivity


class TripActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TripActivity
        fields = ['id', 'activity', 'day', 'time']


class TripStopSerializer(serializers.ModelSerializer):
    activities = TripActivitySerializer(many=True, read_only=True)
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = TripStop
        fields = ['id', 'city', 'city_name', 'start_date', 'end_date', 'position', 'activities']


class TripSerializer(serializers.ModelSerializer):
    stops = TripStopSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date', 
            'cover_image', 'is_public', 'share_uuid', 'user', 'user_name', 'stops'
        ]
        read_only_fields = ['user', 'share_uuid']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TripCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for trip creation from BuildItinerary page"""
    destination = serializers.CharField(write_only=True, required=False)
    budget = serializers.CharField(write_only=True, required=False)
    sections = serializers.JSONField(write_only=True, required=False)
    
    class Meta:
        model = Trip
        fields = ['name', 'description', 'start_date', 'end_date', 'destination', 'budget', 'sections']

    def create(self, validated_data):
        # Extract extra fields that aren't part of Trip model
        destination = validated_data.pop('destination', '')
        budget = validated_data.pop('budget', '')
        sections = validated_data.pop('sections', [])
        
        # Store destination and budget in description if provided
        description_parts = []
        if validated_data.get('description'):
            description_parts.append(validated_data['description'])
        if destination:
            description_parts.append(f"Destination: {destination}")
        if budget:
            description_parts.append(f"Budget: {budget}")
        if sections:
            description_parts.append(f"Sections: {len(sections)}")
        
        validated_data['description'] = ' | '.join(description_parts)
        validated_data['user'] = self.context['request'].user
        
        return Trip.objects.create(**validated_data)


class TripListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing trips"""
    stops_count = serializers.IntegerField(source='stops.count', read_only=True)
    
    class Meta:
        model = Trip
        fields = ['id', 'name', 'description', 'start_date', 'end_date', 'cover_image', 'is_public', 'stops_count']
