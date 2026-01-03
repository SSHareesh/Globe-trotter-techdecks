from datetime import date

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models.trips import Trip
from core.serializers.trips import TripCreateSerializer, TripListSerializer, TripSerializer


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).prefetch_related('stops').order_by('-start_date')

    def get_serializer_class(self):
        if self.action == 'create':
            return TripCreateSerializer
        if self.action == 'list':
            return TripListSerializer
        return TripSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        today = date.today()
        trips_with_status = []
        for trip_data in serializer.data:
            start = date.fromisoformat(trip_data['start_date'])
            end = date.fromisoformat(trip_data['end_date'])
            if end < today:
                trip_data['status'] = 'completed'
            elif start <= today <= end:
                trip_data['status'] = 'ongoing'
            else:
                trip_data['status'] = 'upcoming'
            trips_with_status.append(trip_data)

        return Response(trips_with_status)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        today = date.today()
        trip_data = serializer.data
        start = date.fromisoformat(trip_data['start_date'])
        end = date.fromisoformat(trip_data['end_date'])
        if end < today:
            trip_data['status'] = 'completed'
        elif start <= today <= end:
            trip_data['status'] = 'ongoing'
        else:
            trip_data['status'] = 'upcoming'

        return Response(trip_data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        today = date.today()
        queryset = self.get_queryset().filter(start_date__gt=today)
        serializer = TripListSerializer(queryset, many=True)
        data = []
        for trip_data in serializer.data:
            trip_data['status'] = 'upcoming'
            data.append(trip_data)
        return Response(data)

    @action(detail=False, methods=['get'])
    def ongoing(self, request):
        today = date.today()
        queryset = self.get_queryset().filter(start_date__lte=today, end_date__gte=today)
        serializer = TripListSerializer(queryset, many=True)
        data = []
        for trip_data in serializer.data:
            trip_data['status'] = 'ongoing'
            data.append(trip_data)
        return Response(data)

    @action(detail=False, methods=['get'])
    def completed(self, request):
        today = date.today()
        queryset = self.get_queryset().filter(end_date__lt=today)
        serializer = TripListSerializer(queryset, many=True)
        data = []
        for trip_data in serializer.data:
            trip_data['status'] = 'completed'
            data.append(trip_data)
        return Response(data)
