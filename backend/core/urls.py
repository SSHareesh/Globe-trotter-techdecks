from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from core.api.auth import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    ChangePasswordView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)
from core.api.community import PostListCreateView, CommentListCreateView, like_post
from core.api.trips import TripViewSet

router = DefaultRouter()
router.register(r'trips', TripViewSet, basename='trip')

app_name = 'core'

urlpatterns = [
    path('', include(router.urls)),
    # Authentication
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Password Reset
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # Community endpoints
    path('community/posts/', PostListCreateView.as_view(), name='community-posts'),
    path('community/posts/<int:post_id>/like/', like_post, name='post-like'),
    path('community/posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='post-comments'),
]
