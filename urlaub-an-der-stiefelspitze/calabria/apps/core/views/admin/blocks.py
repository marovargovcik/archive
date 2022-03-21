from crispy_forms.templatetags.crispy_forms_filters import as_crispy_form
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404

from calabria.apps.core.forms import (
    ImgurAlbumBlockForm, ImgurImageBlockForm, PageJumpsBlockForm, StaticBlockForm, TextBlockForm, VideoBlockForm,
    MapBlockForm
)
from calabria.apps.core.models import (
    Block, BlockType, PageTranslation,
    ImgurAlbumBlock, ImgurImageBlock, PageJumpsBlock, StaticBlock, TextBlock, VideoBlock, MapBlock
)


@login_required
def add(request, pk, language, block_type_slug):
    page_translation = get_object_or_404(
        PageTranslation, page_id=pk, language=language)
    # Get correct form class
    form_class = _get_form_class(block_type_slug)
    add_block_form = form_class(request.POST or None, request.FILES or None)
    if request.method == 'POST' and add_block_form.is_valid():
        # Get instance but do not commit because
        # mandatory attributes are missing
        block = add_block_form.save(commit=False)
        # Bind mandatory attributes
        block.type = BlockType.objects.get(slug=block_type_slug)
        block.page_translation = page_translation
        # Save and redirect to page translation's edit
        block.save()
        return redirect(page_translation.get_edit_url())
    return HttpResponse(as_crispy_form(add_block_form))


@login_required
def edit(request, pk, language, block_pk):
    block = get_object_or_404(Block, pk=block_pk)
    # Get correct form class
    form_class = _get_form_class(block.type.slug)
    edit_block_form = form_class(
        request.POST or None, request.FILES or None, instance=block.load())
    if request.method == 'POST' and edit_block_form.is_valid():
        # Save and redirect to page translation's edit
        edit_block_form.save()
        return redirect(block.page_translation.get_edit_url())
    return HttpResponse(as_crispy_form(edit_block_form))


@login_required
def delete(request, pk, language, block_pk):
    block = get_object_or_404(Block, pk=block_pk)
    if request.method == 'POST':
        # Delete and redirect to edit
        block.delete()
        return redirect(block.page_translation.get_edit_url())
    return render(request, 'admin/pages/delete.html', {
        'obj': block,
    })


def _get_form_class(block_type_slug):
    # Return correct form class according to provided block_type.
    if block_type_slug == 'imgur-album':
        return ImgurAlbumBlockForm
    elif block_type_slug == 'imgur-image':
        return ImgurImageBlockForm
    elif block_type_slug == 'page-jumps':
        return PageJumpsBlockForm
    elif block_type_slug == 'static':
        return StaticBlockForm
    elif block_type_slug == 'text':
        return TextBlockForm
    elif block_type_slug == 'video':
        return VideoBlockForm
    elif block_type_slug == 'map':
        return MapBlockForm
