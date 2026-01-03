from rest_framework import viewsets, permissions
from core.models.trips import Trip
from core.serializers.trips import TripSerializer

class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user).order_by('-start_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
