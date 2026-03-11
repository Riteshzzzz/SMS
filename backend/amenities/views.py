from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Amenity, AmenityBooking
from .serializers import AmenitySerializer, AmenityBookingSerializer
from users.permissions import IsAdmin, IsAdminOrResident


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return super().get_permissions()

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        amenity = self.get_object()
        date = request.query_params.get('date')
        bookings = AmenityBooking.objects.filter(
            amenity=amenity,
            booking_date=date,
            booking_status__in=['pending', 'approved']
        )
        booked_slots = AmenityBookingSerializer(bookings, many=True).data
        return Response({
            'amenity': AmenitySerializer(amenity).data,
            'booked_slots': booked_slots
        })


class AmenityBookingViewSet(viewsets.ModelViewSet):
    queryset = AmenityBooking.objects.all()
    serializer_class = AmenityBookingSerializer
    permission_classes = [IsAdminOrResident]

    def perform_create(self, serializer):
        serializer.save(booked_by=self.request.user)

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        booking = self.get_object()
        booking.booking_status = 'approved'
        booking.approved_by = request.user
        booking.approval_date = timezone.now()
        booking.save()
        return Response(AmenityBookingSerializer(booking).data)

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        booking = self.get_object()
        booking.booking_status = 'rejected'
        booking.rejection_reason = request.data.get('reason', '')
        booking.save()
        return Response(AmenityBookingSerializer(booking).data)

    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        bookings = AmenityBooking.objects.filter(booked_by=request.user)
        serializer = AmenityBookingSerializer(bookings, many=True)
        return Response(serializer.data)

