from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.urls import include, path

from calabria.apps.core.urls import admin_urlpatterns, helpers_urlpatterns, web_urlpatterns


urlpatterns = [
    path('', include(helpers_urlpatterns)),
    path('', include(admin_urlpatterns)),
]

urlpatterns += i18n_patterns(
    path('', include(web_urlpatterns)),
)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
