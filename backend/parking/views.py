from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import ParkingSlot
from .serializers import ParkingSlotSerializer
from users.permissions import IsAdmin


class ParkingSlotViewSet(viewsets.ModelViewSet):
    queryset = ParkingSlot.objects.all()
    serializer_class = ParkingSlotSerializer
    permission_classes = [IsAdmin]

    @action(detail=True, methods=['post'])
    def allocate(self, request, pk=None):
        slot = self.get_object()
        slot.allocated_to_flat_id = request.data.get('flat_id')
        slot.vehicle_number = request.data.get('vehicle_number', '')
        slot.vehicle_type = request.data.get('vehicle_type', '')
        slot.allocation_date = timezone.now().date()
        slot.is_occupied = True
        slot.save()
        return Response(ParkingSlotSerializer(slot).data)

    @action(detail=True, methods=['post'])
    def deallocate(self, request, pk=None):
        slot = self.get_object()
        slot.allocated_to_flat = None
        slot.vehicle_number = ''
        slot.vehicle_type = ''
        slot.is_occupied = False
        slot.save()
        return Response(ParkingSlotSerializer(slot).data)

    @action(detail=False, methods=['post'])
    def report_violation(self, request):
        return Response({'status': 'violation reported', 'data': request.data})

