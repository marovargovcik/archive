import calabria.env as env

from django.conf import settings
from django.urls import reverse

from calabria.apps.core.models import Page
from calabria.apps.core.forms import ContactForm


def in_development(request):
    return {
        'DEV_MODE': env.DEBUG
    }


def branch(request):
    b = 'admin' if 'admin' in request.path else 'web'
    return {
        'BRANCH': b
    }


def language_codes(request):
    return {
        'LANGUAGE_CODES': [language_set[0] for language_set in settings.LANGUAGES]
    }


def top_menu_pages(request):
    return {
        'top_menu_pages': Page.get_top_menu_pages()
    }


def bottom_menu_pages(request):
    return {
        'bottom_menu_pages': Page.get_bottom_menu_pages()
    }


def contact_form(request):
    return {
        'contact_form': ContactForm()
    }


def menu(request):
    m = [
        {
            'category': 'General',
            'items': [
                {
                    'name': 'Pages',
                    'icon': 'far fa-file',
                    'url': reverse('admin_pages_listing'),
                },
            ],
        },
        {
            'category': 'User',
            'items': [
                {
                    'name': 'Sign out',
                    'icon': 'fas fa-sign-out-alt',
                    'url': reverse('admin_logout'),
                },
            ],
        }
    ]
    for group in m:
        for item in group['items']:
            item['active'] = request.path.find(item['url']) == 0
    return {
        'menu': m,
    }
