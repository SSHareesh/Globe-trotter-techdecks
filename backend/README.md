# Globe Trotter - Backend API

Django REST Framework backend for the Globe Trotter travel planning application with JWT authentication.


# Create your views here.
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py createsuperuser

# Run the development server
python manage.py runserver