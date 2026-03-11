from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from flats.models import Flat
from security.models import SecurityProfile
from django.utils import timezone
import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial data for the Society Management System'

    def handle(self, *args, **options):
        self.stdout.write('Seeding data...')

        # 1. Create Flat
        flat, created = Flat.objects.get_or_create(
            flat_no='A-101',
            defaults={
                'owner_name': 'Ritesh Bhardwaj',
                'contact_no': '9876543210',
                'floor_no': 1,
                'tower_block': 'A',
                'bhk_type': '2BHK',
                'area_sqft': 1200.00,
                'occupancy_status': 'owner_occupied',
            }
        )
        if created:
            self.stdout.write(f'Created flat {flat.flat_no}')

        # 2. Create Admin User
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                role='admin'
            )
            self.stdout.write('Created admin user')

        # 3. Create Resident User
        if not User.objects.filter(username='resident').exists():
            User.objects.create_user(
                username='resident',
                email='resident@example.com',
                password='resident123',
                role='resident',
                flat=flat
            )
            self.stdout.write('Created resident user')

        # 4. Create Security Profile
        security_profile, created = SecurityProfile.objects.get_or_create(
            employee_id='SEC001',
            defaults={
                'name': 'Security Officer',
                'contact_no': '9999999999',
                'date_of_joining': datetime.date.today(),
                'employment_type': 'permanent',
                'shift': 'day',
                'shift_timing': '9 AM - 9 PM',
            }
        )
        if created:
            self.stdout.write(f'Created security profile {security_profile.employee_id}')

        # 5. Create Security User
        if not User.objects.filter(username='security').exists():
            User.objects.create_user(
                username='security',
                email='security@example.com',
                password='security123',
                role='security',
                security_profile=security_profile
            )
            self.stdout.write('Created security user')

        self.stdout.write(self.style.SUCCESS('Successfully seeded data'))
