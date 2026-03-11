from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from flats.models import Flat
from security.models import SecurityProfile
from django.conf import settings
import datetime

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial data for the Society Management System'

    def handle(self, *args, **options):
        db_engine = settings.DATABASES['default']['ENGINE']
        self.stdout.write(f'Using database engine: {db_engine}')
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
        else:
            self.stdout.write(f'Flat {flat.flat_no} already exists')

        # 2. Admin User
        admin_user = User.objects.filter(username='admin').first()
        if not admin_user:
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                role='admin'
            )
            self.stdout.write('Created admin user')
        else:
            admin_user.set_password('admin123')
            admin_user.role = 'admin'
            admin_user.save()
            self.stdout.write('Updated admin password')

        # 3. Resident User
        resident_user = User.objects.filter(username='resident').first()
        if not resident_user:
            User.objects.create_user(
                username='resident',
                email='resident@example.com',
                password='resident123',
                role='resident',
                flat=flat
            )
            self.stdout.write('Created resident user')
        else:
            resident_user.set_password('resident123')
            resident_user.role = 'resident'
            resident_user.flat = flat
            resident_user.save()
            self.stdout.write('Updated resident password')

        # 4. Security Profile
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

        # 5. Security User
        security_user = User.objects.filter(username='security').first()
        if not security_user:
            User.objects.create_user(
                username='security',
                email='security@example.com',
                password='security123',
                role='security',
                security_profile=security_profile
            )
            self.stdout.write('Created security user')
        else:
            security_user.set_password('security123')
            security_user.role = 'security'
            security_user.security_profile = security_profile
            security_user.save()
            self.stdout.write('Updated security password')

        self.stdout.write(self.style.SUCCESS('Successfully seeded data'))
