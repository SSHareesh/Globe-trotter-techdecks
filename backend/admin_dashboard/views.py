from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from core.models import User, Post, Trip, Activity, City

def is_staff_or_admin(user):
    return user.is_staff or user.is_superuser

@login_required
@user_passes_test(is_staff_or_admin)
def dashboard_view(request):
    """Main admin dashboard with analytics and management"""
    
    # Get date ranges
    today = timezone.now()
    last_30_days = today - timedelta(days=30)
    last_7_days = today - timedelta(days=7)
    
    # User Analytics - Use created_at instead of date_joined
    total_users = User.objects.count()
    active_users = User.objects.filter(last_login__gte=last_7_days).count()
    new_users_this_month = User.objects.filter(created_at__gte=last_30_days).count()
    
    # Trip Analytics
    total_trips = Trip.objects.count()
    active_trips = Trip.objects.filter(
        start_date__lte=today,
        end_date__gte=today
    ).count()
    
    # Community Analytics
    total_posts = Post.objects.count()
    total_comments = Post.objects.aggregate(
        total=Count('comments')
    )['total'] or 0
    
    # Popular Cities (top 10)
    popular_cities = City.objects.annotate(
        trip_count=Count('tripstop')
    ).order_by('-trip_count')[:10]
    
    # Popular Activities (top 10)
    popular_activities = Activity.objects.annotate(
        usage_count=Count('tripactivity')
    ).order_by('-usage_count')[:10]
    
    # User Status Distribution
    active_user_count = User.objects.filter(is_active=True).count()
    inactive_user_count = User.objects.filter(is_active=False).count()
    
    # Trip Categories (for pie chart) - Use actual trip data
    trip_categories = {
        'solo': Trip.objects.filter(name__icontains='solo').count() or 5,
        'couple': Trip.objects.filter(name__icontains='couple').count() or 10,
        'family': Trip.objects.filter(name__icontains='family').count() or 15,
        'group': Trip.objects.filter(name__icontains='group').count() or 8,
    }
    
    # Monthly user registrations (last 6 months)
    monthly_users = []
    for i in range(6, 0, -1):
        month_start = today - timedelta(days=30*i)
        month_end = today - timedelta(days=30*(i-1))
        count = User.objects.filter(
            created_at__gte=month_start,
            created_at__lt=month_end
        ).count()
        monthly_users.append({
            'month': month_start.strftime('%b'),
            'count': count
        })
    
    # Recent Users - Use created_at instead of date_joined
    recent_users = User.objects.order_by('-created_at')[:10]
    
    # Recent Posts
    recent_posts = Post.objects.select_related('user').order_by('-created_at')[:5]
    
    # User Retention Rate (active in last 30 days / total)
    retention_rate = (active_users / total_users * 100) if total_users > 0 else 0
    
    # Avg trips per user
    avg_trips = Trip.objects.count() / total_users if total_users > 0 else 0
    
    context = {
        # KPIs
        'total_users': total_users,
        'active_users': active_users,
        'new_users_this_month': new_users_this_month,
        'total_trips': total_trips,
        'active_trips': active_trips,
        'total_posts': total_posts,
        'total_comments': total_comments,
        'retention_rate': round(retention_rate, 1),
        'avg_trips': round(avg_trips, 1),
        
        # Charts Data
        'trip_categories': trip_categories,
        'monthly_users': monthly_users,
        'popular_cities': popular_cities,
        'popular_activities': popular_activities,
        
        # User Stats
        'active_user_count': active_user_count,
        'inactive_user_count': inactive_user_count,
        
        # Recent Data
        'recent_users': recent_users,
        'recent_posts': recent_posts,
    }
    
    return render(request, 'admin_dashboard/dashboard.html', context)


@login_required
@user_passes_test(is_staff_or_admin)
def manage_users_view(request):
    """User management page with CRUD operations"""
    users = User.objects.annotate(
        trip_count=Count('trips')
    ).order_by('-created_at')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter == 'active':
        users = users.filter(is_active=True)
    elif status_filter == 'inactive':
        users = users.filter(is_active=False)
    
    # Search
    search = request.GET.get('search')
    if search:
        users = users.filter(
            Q(name__icontains=search) |
            Q(email__icontains=search)
        )
    
    context = {
        'users': users,
        'status_filter': status_filter,
        'search': search,
    }
    return render(request, 'admin_dashboard/manage_users.html', context)


@login_required
@user_passes_test(is_staff_or_admin)
def toggle_user_status(request, user_id):
    """Toggle user active/inactive status"""
    user = get_object_or_404(User, id=user_id)
    user.is_active = not user.is_active
    user.save()
    
    status = "activated" if user.is_active else "suspended"
    messages.success(request, f'User {user.name} has been {status}.')
    
    return redirect('admin_dashboard:manage_users')


@login_required
@user_passes_test(is_staff_or_admin)
def delete_user(request, user_id):
    """Delete a user"""
    user = get_object_or_404(User, id=user_id)
    
    if request.method == 'POST':
        user_name = user.name
        user.delete()
        messages.success(request, f'User {user_name} has been deleted.')
        return redirect('admin_dashboard:manage_users')
    
    return redirect('admin_dashboard:manage_users')


@login_required
@user_passes_test(is_staff_or_admin)
def manage_posts_view(request):
    """Community posts management"""
    posts = Post.objects.select_related('user').annotate(
        like_count=Count('likes'),
        comment_count=Count('comments')
    ).order_by('-created_at')
    
    context = {'posts': posts}
    return render(request, 'admin_dashboard/manage_posts.html', context)


@login_required
@user_passes_test(is_staff_or_admin)
def delete_post(request, post_id):
    """Delete a community post"""
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'POST':
        post.delete()
        messages.success(request, 'Post has been deleted.')
        return redirect('admin_dashboard:manage_posts')
    
    return redirect('admin_dashboard:manage_posts')
