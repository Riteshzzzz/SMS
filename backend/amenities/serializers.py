from rest_framework import serializers
from .models import Amenity, AmenityBooking


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class AmenityBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmenityBooking
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
