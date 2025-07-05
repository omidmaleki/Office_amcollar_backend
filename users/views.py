# users/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
#---------------------------------------------------------------------
User = get_user_model()

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):

        user = serializer.save()
        if user.role == 'vet':
            user.is_active = False
            user.save()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        return Response({"message": "ثبت نام موفقیت‌آمیز بود. اگر دامپزشک هستید منتظر تایید باشید."}, status=status.HTTP_201_CREATED)

class VetApprovalView(APIView):
    permission_classes = [IsAdminUser]  # فقط ادمین‌ها اجازه دارند

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk, role='vet')
        if user.is_active:
            return Response({"detail": "دامپزشک قبلا فعال شده است."}, status=status.HTTP_400_BAD_REQUEST)
        user.is_active = True
        user.save()
        return Response({"detail": "دامپزشک فعال شد."}, status=status.HTTP_200_OK)