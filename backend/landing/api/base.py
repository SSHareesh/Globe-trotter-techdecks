from __future__ import annotations

from rest_framework import exceptions, status
from rest_framework.views import APIView

from landing.api.errors import error_response
from landing.services.http import UpstreamError


class LandingAPIView(APIView):
    """Base APIView for landing endpoints.

    Keeps landing error responses consistent without changing global DRF behavior
    (so existing auth endpoints remain untouched).
    """

    def handle_exception(self, exc):
        if isinstance(exc, UpstreamError):
            return error_response(
                status_code=status.HTTP_502_BAD_GATEWAY,
                code='upstream_error',
                message=str(exc),
                details={
                    'status': getattr(exc, 'status', None),
                    'details': getattr(exc, 'details', None),
                },
            )

        if isinstance(exc, exceptions.ValidationError):
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                code='validation_error',
                message='Validation error',
                details=exc.detail,
            )

        if isinstance(exc, (exceptions.NotAuthenticated, exceptions.AuthenticationFailed)):
            return error_response(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code='unauthorized',
                message='Authentication required',
            )

        if isinstance(exc, exceptions.PermissionDenied):
            return error_response(
                status_code=status.HTTP_403_FORBIDDEN,
                code='forbidden',
                message='You do not have permission to perform this action',
            )

        if isinstance(exc, exceptions.Throttled):
            return error_response(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                code='rate_limited',
                message='Too many requests',
                details={'wait': getattr(exc, 'wait', None)},
            )

        return error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            code='server_error',
            message='Unexpected server error',
        )
