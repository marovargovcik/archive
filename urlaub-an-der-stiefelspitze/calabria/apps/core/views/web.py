from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponseServerError, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import translation

from calabria.apps.core.models import Page


def index(request):
    """
    Matching bare base url. Get page that is selected as index
    and return it to page_resolver function which takes
    care of rendering correct page.
    """
    page = get_object_or_404(Page, is_default_home_page=True)
    return page_resolver(request, page=page)


def page_resolver(request, url=None, page=None):
    """
    Main web page view. Match requests that do not fit any other
    more specific view and find requested page by its URL.
    If there are no results then display NO_TRANSLATION_FOUND error.
    """
    if not page:
        page = get_object_or_404(
            Page,
            page_translation_set__language=translation.get_language(),
            page_translation_set__url=url,
        )
    page_translation = page.get_translation()
    if not page_translation:
        return redirect(reverse('helpers_redirect_to_translation', kwargs={
            'pk': page.pk,
        }))
    return render(request, 'web/page.html', {
        'page_translation': page_translation,
        'title': page_translation.name,
    })


# def send_email(request):
#     email = request.POST.get('email')
#     message = request.POST.get('message')
#     try:
#         send_email('[Contact form] Urlaub and der Stiefelspitze', message, settings.EMAIL_HOST_USER, [email])
#     except Exception:
#         return HttpResponseServerError()
#     return HttpResponse('All good! We will get in touch shortly!')
