from crispy_forms.templatetags.crispy_forms_filters import as_crispy_form
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.urls import reverse

from calabria.apps.core.forms import PageTranslationForm, PageForm
from calabria.apps.core.models import BlockType, Page, PageTranslation


@login_required
def add(request, pk, language):
    # Render template if desired language is not supported
    if language not in [lang_set[0] for lang_set in settings.LANGUAGES]:
        return HttpResponse('language not supported')
    page = get_object_or_404(Page, pk=pk)
    # Redirect if translation for this language exists
    page_translation = page.get_translation(language=language)
    if page_translation:
        return redirect(page_translation.get_edit_url())
    page_translation_form = PageTranslationForm(request.POST or None)
    if request.method == 'POST' and page_translation_form.is_valid():
        # Get instance but do not commit because
        # mandatory attributes are missing
        page_translation = page_translation_form.save(commit=False)
        # Bind mandatory attributes
        page_translation.page = page
        page_translation.language = language
        # Save and redirect to edit
        page_translation.save()
        return redirect(page_translation.get_edit_url())
    return HttpResponse(as_crispy_form(page_translation_form))


@login_required
def edit(request, pk, language):
    # Get requested translation
    page_translation = get_object_or_404(
        PageTranslation, page_id=pk, language=language)
    edit_page_form = PageForm(instance=page_translation.page)
    edit_page_translation_form = PageTranslationForm(
        request.POST or None, instance=page_translation)
    if request.method == 'POST' and edit_page_translation_form.is_valid():
        # Save and redirect to pages listing
        edit_page_translation_form.save()
        return redirect(page_translation.get_edit_url())
    # Get all block types
    block_types = BlockType.objects.all()
    return render(request, 'admin/pages/edit.html', {
        'page_translation': page_translation,
        'block_types': block_types,
        'edit_page_form': edit_page_form,
        'edit_page_translation_form': edit_page_translation_form,
        'title': 'Edit page translation',
    })


@login_required
def delete(request, pk, language):
    # Get requested translation
    page_translation = get_object_or_404(
        PageTranslation, page_id=pk, language=language)
    page = page_translation.page
    if request.method == 'POST':
        # Delete and redirect to listing
        page_translation.delete()
        return redirect(reverse('admin_pages_listing'))
    return render(request, 'admin/pages/delete.html', {
        'obj': page_translation,
    })
