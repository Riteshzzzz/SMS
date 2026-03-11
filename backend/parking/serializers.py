from rest_framework import serializers
from .models import ParkingSlot


class ParkingSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlot
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
