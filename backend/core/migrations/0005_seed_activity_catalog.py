from django.db import migrations


def seed_activity_catalog(apps, schema_editor):
    City = apps.get_model('core', 'City')
    Activity = apps.get_model('core', 'Activity')

    cities = [
        {'name': 'Paris', 'country': 'France', 'cost_index': 75.0, 'popularity_score': 95.0},
        {'name': 'Tokyo', 'country': 'Japan', 'cost_index': 80.0, 'popularity_score': 98.0},
        {'name': 'Bali', 'country': 'Indonesia', 'cost_index': 45.0, 'popularity_score': 90.0},
        {'name': 'New York', 'country': 'USA', 'cost_index': 85.0, 'popularity_score': 97.0},
        {'name': 'Dubai', 'country': 'UAE', 'cost_index': 82.0, 'popularity_score': 92.0},
    ]

    city_by_key = {}
    for city_data in cities:
        city, _ = City.objects.get_or_create(
            name=city_data['name'],
            country=city_data['country'],
            defaults={
                'cost_index': city_data['cost_index'],
                'popularity_score': city_data['popularity_score'],
            },
        )
        city_by_key[f"{city.name}, {city.country}"] = city

    activities = [
        {
            'name': 'Eiffel Tower Guided Tour',
            'category': 'Tour',
            'description': 'Skip-the-line access with expert guide',
            'destination': 'Paris, France',
            'cost': 45.0,
            'duration': 120,
            'rating': 4.8,
            'image_url': 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
        {
            'name': 'Sushi Making Class',
            'category': 'Class',
            'description': 'Learn from master chefs in authentic setting',
            'destination': 'Tokyo, Japan',
            'cost': 85.0,
            'duration': 180,
            'rating': 4.9,
            'image_url': 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
        {
            'name': 'Sunrise Yoga Retreat',
            'category': 'Wellness',
            'description': 'Peaceful morning practice overlooking rice terraces',
            'destination': 'Bali, Indonesia',
            'cost': 25.0,
            'duration': 90,
            'rating': 4.7,
            'image_url': 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
        {
            'name': 'Broadway Show Experience',
            'category': 'Entertainment',
            'description': 'Premium seats to top-rated shows',
            'destination': 'New York, USA',
            'cost': 150.0,
            'duration': 180,
            'rating': 4.9,
            'image_url': 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
        {
            'name': 'Desert Safari Adventure',
            'category': 'Adventure',
            'description': 'Thrilling dune bashing and camel riding',
            'destination': 'Dubai, UAE',
            'cost': 95.0,
            'duration': 360,
            'rating': 4.6,
            'image_url': 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=400',
        },
    ]

    for activity in activities:
        city = city_by_key.get(activity['destination'])
        Activity.objects.get_or_create(
            name=activity['name'],
            defaults={
                'category': activity['category'],
                'description': activity['description'],
                'city': city,
                'cost': activity['cost'],
                'duration': activity['duration'],
                'rating': activity['rating'],
                'image_url': activity['image_url'],
            },
        )


def unseed_activity_catalog(apps, schema_editor):
    Activity = apps.get_model('core', 'Activity')
    # Only delete the known seeded rows by name.
    seeded_names = [
        'Eiffel Tower Guided Tour',
        'Sushi Making Class',
        'Sunrise Yoga Retreat',
        'Broadway Show Experience',
        'Desert Safari Adventure',
    ]
    Activity.objects.filter(name__in=seeded_names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_activity_city_activity_description_activity_rating'),
    ]

    operations = [
        migrations.RunPython(seed_activity_catalog, reverse_code=unseed_activity_catalog),
    ]
