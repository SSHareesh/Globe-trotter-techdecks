# 🌍 GlobeTrotter Backend API

Django REST Framework backend powering the GlobeTrotter travel planning platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Django Apps](#django-apps)
- [External Integrations](#external-integrations)
- [Testing](#testing)

---

## 🎯 Overview

The backend provides a RESTful API for:
- **User Authentication** - JWT-based auth with registration and profile management
- **Trip Management** - CRUD operations for travel itineraries
- **Destination Discovery** - Real-time search via Amadeus API
- **AI Features** - Groq-powered chatbot and itinerary enhancement
- **Community** - Social features with posts, likes, and comments
- **Admin Dashboard** - Analytics and user management

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Runtime |
| Django | 4.2.x | Web Framework |
| Django REST Framework | 3.14+ | API Framework |
| SimpleJWT | 5.3+ | JWT Authentication |
| SQLite | Default | Development Database |
| PostgreSQL | 14+ | Production Database |
| Pillow | 10+ | Image Processing |
| python-decouple | 3.8+ | Environment Config |

---

## 📁 Project Structure

```
.
├── api
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations
│   │   ├── __init__.py
│   │   └── 0001_initial.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   └── views.py
├── GlobeTrotter
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py
└── requirements.txt
```

---

## 📦 Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/globetrotter-backend.git
    cd globetrotter-backend
    ```
    
2. **Create a virtual environment**:
    ```bash
    python -m venv venv
    ```
    
3. **Activate the virtual environment**:
    - Windows:
        ```bash
        venv\Scripts\activate
        ```
    - Linux/Mac:
        ```bash
        source venv/bin/activate
        ```
        
4. **Install required packages**:
    ```bash
    pip install -r requirements.txt
    ```
    
5. **Apply database migrations**:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
    
6. **Create a superuser**:
    ```bash
    python manage.py createsuperuser
    ```

---

## ⚙️ Configuration

- Copy `.env.example` to `.env` and update the values as needed.
- Ensure `DEBUG` is set to `True` for development, `False` for production.
- Configure allowed hosts in `ALLOWED_HOSTS` in `settings.py`.

---

## 🚀 Running the Server

- For development:
    ```bash
    python manage.py runserver
    ```
- For production, use a WSGI server like Gunicorn and configure Nginx as a reverse proxy.

---

## 📚 API Documentation

- The API follows RESTful principles and uses JWT for authentication.
- Base URL: `http://localhost:8000/api`
- Authentication: Bearer token in the Authorization header.
- Content-Type: `application/json` for requests and responses.

---

## 🧩 Django Apps

- **api**: Core app for user, trip, and destination models and APIs.
- **admin**: Custom admin panel configurations.
- **auth**: User authentication and authorization.

---

## 🔌 External Integrations

- **Amadeus API**: For flight and hotel search.
- **Groq API**: For AI-powered chatbot and itinerary suggestions.

---

## 🧪 Testing

- Unit tests: `python manage.py test`
- Coverage report: `coverage run -m unittest discover`