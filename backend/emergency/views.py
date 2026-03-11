from rest_framework import viewsets
from .models import EmergencyContact
from .serializers import EmergencyContactSerializer
from users.permissions import IsAdmin


class EmergencyContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.filter(is_active=True).order_by('priority_order')
    serializer_class = EmergencyContactSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()

