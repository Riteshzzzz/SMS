from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import UserViewSet
from flats.views import FlatViewSet
from maintenance.views import MaintenanceViewSet
from notices.views import NoticeViewSet
from complaints.views import ComplaintViewSet
from visitors.views import VisitorViewSet
from security.views import SecurityProfileViewSet, AttendanceRecordViewSet, IncidentReportViewSet
from amenities.views import AmenityViewSet, AmenityBookingViewSet
from parking.views import ParkingSlotViewSet
from events.views import EventViewSet
from documents.views import DocumentViewSet
from polls.views import PollViewSet
from emergency.views import EmergencyContactViewSet
from expenses.views import ExpenseViewSet
from payments.views import PaymentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'flats', FlatViewSet)
router.register(r'maintenance', MaintenanceViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'complaints', ComplaintViewSet)
router.register(r'visitors', VisitorViewSet)
router.register(r'security-profiles', SecurityProfileViewSet)
router.register(r'attendance-records', AttendanceRecordViewSet)
router.register(r'incident-reports', IncidentReportViewSet)
router.register(r'amenities', AmenityViewSet)
router.register(r'amenity-bookings', AmenityBookingViewSet)
router.register(r'parking-slots', ParkingSlotViewSet)
router.register(r'events', EventViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'polls', PollViewSet)
router.register(r'emergency-contacts', EmergencyContactViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/reports/', include('reports.urls')),
]
