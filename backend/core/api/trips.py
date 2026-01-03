from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.models.trips import Trip, TripStop, TripActivity
from core.serializers.trips import TripSerializer, TripCreateSerializer, TripListSerializer, TripStopSerializer
from datetime import date


class TripViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).prefetch_related('stops')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TripCreateSerializer
        elif self.action == 'list':
            return TripListSerializer
        return TripSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add status field based on dates
        today = date.today()
        trips_with_status = []
        
        for trip_data in serializer.data:
            start_date = date.fromisoformat(trip_data['start_date'])
            end_date = date.fromisoformat(trip_data['end_date'])
            
            if end_date < today:
                trip_data['status'] = 'completed'
            elif start_date <= today <= end_date:
                trip_data['status'] = 'ongoing'
            else:
                trip_data['status'] = 'upcoming'
            
            trips_with_status.append(trip_data)
        
        return Response(trips_with_status)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Add status field
        today = date.today()
        trip_data = serializer.data
        start_date = date.fromisoformat(trip_data['start_date'])
        end_date = date.fromisoformat(trip_data['end_date'])
        
        if end_date < today:
            trip_data['status'] = 'completed'
        elif start_date <= today <= end_date:
            trip_data['status'] = 'ongoing'
        else:
            trip_data['status'] = 'upcoming'
        
        return Response(trip_data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming trips"""
        today = date.today()
        queryset = self.get_queryset().filter(start_date__gt=today)
        serializer = TripListSerializer(queryset, many=True)
        
        trips_with_status = []
        for trip_data in serializer.data:
            trip_data['status'] = 'upcoming'
            trips_with_status.append(trip_data)
        
        return Response(trips_with_status)
    
    @action(detail=False, methods=['get'])
    def ongoing(self, request):
        """Get ongoing trips"""
        today = date.today()
        queryset = self.get_queryset().filter(start_date__lte=today, end_date__gte=today)
        serializer = TripListSerializer(queryset, many=True)
        
        trips_with_status = []
        for trip_data in serializer.data:
            trip_data['status'] = 'ongoing'
            trips_with_status.append(trip_data)
        
        return Response(trips_with_status)
    
    @action(detail=False, methods=['get'])
    def completed(self, request):
        """Get completed trips"""
        today = date.today()
        queryset = self.get_queryset().filter(end_date__lt=today)
        serializer = TripListSerializer(queryset, many=True)
        
        trips_with_status = []
        for trip_data in serializer.data:
            trip_data['status'] = 'completed'
            trips_with_status.append(trip_data)
        
        return Response(trips_with_status)
