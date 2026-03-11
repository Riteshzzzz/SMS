from rest_framework import serializers
from .models import Notice, NoticeAcknowledgment, NoticeAttachment


class NoticeAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeAttachment
        fields = '__all__'


class NoticeAcknowledgmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeAcknowledgment
        fields = '__all__'
        read_only_fields = ['acknowledged_at']


class NoticeSerializer(serializers.ModelSerializer):
    attachments = NoticeAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Notice
        fields = '__all__'
        read_only_fields = ['published_date', 'created_at', 'updated_at']
