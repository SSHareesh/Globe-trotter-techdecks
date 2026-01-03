from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from core.models import Activity, City
from core.serializers.activities import ActivityListSerializer, CitySerializer


class CityViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CitySerializer
    pagination_class = None

    def get_queryset(self):
        qs = City.objects.all().order_by('country', 'name')
        q = self.request.query_params.get('q', '').strip()
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(country__icontains=q))
        return qs


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivityListSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Activity.objects.select_related('city').all()

        q = self.request.query_params.get('q', '').strip()
        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(description__icontains=q)
                | Q(category__icontains=q)
                | Q(city__name__icontains=q)
                | Q(city__country__icontains=q)
            )

        city_id = self.request.query_params.get('city_id')
        if city_id:
            qs = qs.filter(city_id=city_id)

        category = self.request.query_params.get('category', '').strip()
        if category:
            qs = qs.filter(category__iexact=category)

        min_cost = self.request.query_params.get('min_cost')
        if min_cost is not None and str(min_cost).strip() != '':
            try:
                qs = qs.filter(cost__gte=float(min_cost))
            except ValueError:
                pass

        max_cost = self.request.query_params.get('max_cost')
        if max_cost is not None and str(max_cost).strip() != '':
            try:
                qs = qs.filter(cost__lte=float(max_cost))
            except ValueError:
                pass

        min_rating = self.request.query_params.get('min_rating')
        if min_rating is not None and str(min_rating).strip() != '':
            try:
                qs = qs.filter(rating__gte=float(min_rating))
            except ValueError:
                pass

        sort = self.request.query_params.get('sort', 'rating')
        ordering_map = {
            'rating': '-rating',
            'price-low': 'cost',
            'price-high': '-cost',
            'duration': 'duration',
        }
        qs = qs.order_by(ordering_map.get(sort, '-rating'), 'id')

        return qs
