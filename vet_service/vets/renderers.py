import datetime
import jdatetime
from rest_framework.renderers import JSONRenderer

class JalaliJSONRenderer(JSONRenderer):
    """
    JSON Renderer که تمام datetime ها را به شمسی تبدیل می‌کند.
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        def convert(obj):
            if isinstance(obj, dict):
                return {k: convert(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert(i) for i in obj]
            elif isinstance(obj, datetime.datetime):
                return jdatetime.datetime.fromgregorian(datetime=obj).strftime('%Y/%m/%d %H:%M')
            return obj

        data = convert(data)
        return super().render(data, accepted_media_type, renderer_context)
