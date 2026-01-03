from django.urls import path

from landing.views import (
    LandingHealthView,
    LandingConfigView,
    LandingHomeView,
    LandingBannerView,
    LandingDestinationsView,
    LandingTrendingView,
    LandingAttractionsView,
    TripSearchFlightsView,
    TripSearchHotelsView,
    TripAIEnhanceView,
    ChatBotView,
)

app_name = 'landing'

urlpatterns = [
    path('health/', LandingHealthView.as_view(), name='health'),
    path('config/', LandingConfigView.as_view(), name='config'),
    path('home/', LandingHomeView.as_view(), name='home'),
    path('banner/', LandingBannerView.as_view(), name='banner'),
    path('destinations/', LandingDestinationsView.as_view(), name='destinations'),
    path('trending/', LandingTrendingView.as_view(), name='trending'),
    path('attractions/', LandingAttractionsView.as_view(), name='attractions'),
    path('trip/enhance/', TripAIEnhanceView.as_view(), name='trip_enhance'),
    path('trip/flights/', TripSearchFlightsView.as_view(), name='trip_flights'),
    path('trip/hotels/', TripSearchHotelsView.as_view(), name='trip_hotels'),
    path('chat/', ChatBotView.as_view(), name='chat'),
]
