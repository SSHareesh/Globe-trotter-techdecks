from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    language_preference = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)

    # Standard Django Auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Keeping these if they were useful, or removing if strictly following "just these fields"? 
    # The user gave a list. I'll stick to the list + auth requirements.
    # Travel style/currency were in the old file, I'll preserve them as they seem relevant to the app "Globe-trotter",
    # unless strictly forbidden. "User - id, email ...". The user listed specific fields.
    # I will strictly follow the list to avoid clutter, assuming the user wants a reset or specific schema.
    # But I will keep `is_active` and `is_staff` for Django Admin to work nicely.
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name.split()[0] if self.name else ''
