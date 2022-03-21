from django.shortcuts import get_object_or_404, redirect, render, HttpResponse
from django.template import loader, Context

from calabria.apps.core.models import Page, PageTranslation


def redirect_to_translation(request, pk):
    """
    Redirect from currently displayed translation of page to another.
    Used in language switcher as next parameter.
    """
    page = get_object_or_404(Page, pk=pk)
    page_translation = page.get_translation()
    # If there is no translation available show error template
    # with available translations.
    if page_translation is None:
        return render(request, 'custom_errors/translation_not_found.html', {
            'page_translations': page.get_translations(),
            'title': 'Translation is not available',
        })
    # Otherwise just redirect to requested translation of page.
    return redirect(page_translation.get_url())


def sitemap(request):
    page_translations = PageTranslation.objects.all()
    return render(request, 'sitemap.xml', content_type='text/xml', context={
        'page_translations': page_translations
    })
