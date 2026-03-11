from rest_framework import serializers
from .models import Flat, FamilyMember, DomesticHelp, ParkingAllocation

class FamilyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = '__all__'

class DomesticHelpSerializer(serializers.ModelSerializer):
    class Meta:
        model = DomesticHelp
        fields = '__all__'

class ParkingAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingAllocation
        fields = '__all__'

class FlatSerializer(serializers.ModelSerializer):
    family_members = FamilyMemberSerializer(many=True, read_only=True)
    domestic_help = DomesticHelpSerializer(many=True, read_only=True)
    parking_allocations = ParkingAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = Flat
        fields = '__all__'
