from django.conf import settings
from django.contrib.auth.views import LoginView, logout_then_login
from django.urls import path, re_path
from django.views.generic import RedirectView
from django.views.i18n import set_language

from calabria.apps.core.views import admin, helpers, web

admin_urlpatterns = [
    path('admin/', RedirectView.as_view(url=settings.LOGIN_REDIRECT_URL),
         name='admin_index'),
    path('admin/login/', LoginView.as_view(template_name='admin/auth/login.html'),
         name='admin_login'),
    path('admin/logout/', logout_then_login, name='admin_logout'),

    path('admin/pages/', admin.pages.listing, name='admin_pages_listing'),
    path('admin/pages/add/', admin.pages.add, name='admin_pages_add'),
    path('admin/pages/<int:pk>/edit/', admin.pages.edit, name='admin_pages_edit'),
    path('admin/pages/<int:pk>/delete/',
         admin.pages.delete, name='admin_pages_delete'),

    path(
        'admin/pages/<int:pk>/translations/<str:language>/add/',
        admin.translations.add,
        name='admin_page_translations_add',
    ),
    path(
        'admin/pages/<int:pk>/translations/<str:language>/edit/',
        admin.translations.edit,
        name='admin_page_translations_edit',
    ),
    path(
        'admin/pages/<int:pk>/translations/<str:language>/delete/',
        admin.translations.delete,
        name='admin_page_translations_delete',
    ),

    path(
        'admin/pages/<int:pk>/translations/<str:language>/blocks/add/<str:block_type_slug>',
        admin.blocks.add,
        name='admin_page_translation_blocks_add',
    ),
    path(
        'admin/pages/<int:pk>/translations/<str:language>/blocks/<int:block_pk>/edit',
        admin.blocks.edit,
        name='admin_page_translation_blocks_edit',
    ),
    path(
        'admin/pages/<int:pk>/translations/<str:language>/blocks/<int:block_pk>/delete',
        admin.blocks.delete,
        name='admin_page_translation_blocks_delete',
    ),
]

helpers_urlpatterns = [
    path('sitemap/', helpers.sitemap, name='helpers_sitemap'),
    path('set-language/', set_language, name="helpers_set_language"),
    path('redirect/<int:pk>/', helpers.redirect_to_translation,
         name='helpers_redirect_to_translation'),
]

web_urlpatterns = [
    path('', web.index, name='web_index'),
    re_path(r'^(?P<url>.*)/$', web.page_resolver, name='web_page_resolver'),
]
