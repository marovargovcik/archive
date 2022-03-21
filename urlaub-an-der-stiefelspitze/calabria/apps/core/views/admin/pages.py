from crispy_forms.templatetags.crispy_forms_filters import as_crispy_form
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render, HttpResponse
from django.urls import reverse


from calabria.apps.core.forms import PageForm
from calabria.apps.core.models import Page


@login_required
def listing(request):
    pages = Page.objects.all()
    return render(request, 'admin/pages/list.html', {
        'pages': pages,
        'title': 'Pages',
    })


@login_required
def add(request):
    add_page_form = PageForm(request.POST or None, request.FILES or None)
    if request.method == 'POST' and add_page_form.is_valid():
        add_page_form.save()
        return redirect(reverse('admin_pages_listing'))
    return HttpResponse(as_crispy_form(add_page_form))


@login_required
def edit(request, pk):
    page = get_object_or_404(Page, pk=pk)
    edit_page_form = PageForm(request.POST or None, request.FILES or None, instance=page)
    # Alter queryset of form field 'pages' to exclude this page from options
    edit_page_form.fields['parent_page'].queryset = Page.objects.exclude(pk=page.pk)
    if request.method == 'POST' and edit_page_form.is_valid():
        # Save and redirect to edit
        edit_page_form.save()
        return redirect(reverse('admin_pages_listing'))


@login_required
def delete(request, pk):
    page = get_object_or_404(Page, pk=pk)
    if request.method == 'POST':
        # Delete and redirect to listing
        page.delete()
        return redirect(reverse('admin_pages_listing'))
    return render(request, 'admin/pages/delete.html', {
        'obj': page,
    })
