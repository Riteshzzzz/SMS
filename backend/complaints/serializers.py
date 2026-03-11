from rest_framework import serializers
from .models import Complaint, ComplaintStatusHistory, ComplaintPhoto


class ComplaintPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintPhoto
        fields = '__all__'


class ComplaintStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintStatusHistory
        fields = '__all__'
        read_only_fields = ['updated_at']


class ComplaintSerializer(serializers.ModelSerializer):
    photos = ComplaintPhotoSerializer(many=True, read_only=True)
    status_history = ComplaintStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['date_raised', 'created_at', 'updated_at']
