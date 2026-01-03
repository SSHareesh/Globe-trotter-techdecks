from django.urls import path
from . import views

app_name = 'admin_dashboard'

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    path('users/', views.manage_users_view, name='manage_users'),
    path('users/<int:user_id>/toggle/', views.toggle_user_status, name='toggle_user_status'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('posts/', views.manage_posts_view, name='manage_posts'),
    path('posts/<int:post_id>/delete/', views.delete_post, name='delete_post'),
]
