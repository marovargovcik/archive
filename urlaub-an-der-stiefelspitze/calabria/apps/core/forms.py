from django import forms

from calabria.apps.core.models import (
    Page, PageTranslation,
    ImgurAlbumBlock, ImgurImageBlock, PageJumpsBlock, StaticBlock, TextBlock, VideoBlock, MapBlock
)


class PageForm(forms.ModelForm):

    class Meta:
        model = Page
        fields = (
            'name',
            'position',
            'featured_image',
            'parent_page',
            'is_default_home_page',
            'is_in_bottom_menu',
        )


class PageTranslationForm(forms.ModelForm):

    class Meta:
        model = PageTranslation
        fields = (
            'name',
            'url',
            'action_title',
            'action_redirect',
            'description',
        )


class ImgurAlbumBlockForm(forms.ModelForm):

    class Meta:
        model = ImgurAlbumBlock
        fields = (
            'title',
            'position',
            'url',
        )


class ImgurImageBlockForm(forms.ModelForm):

    class Meta:
        model = ImgurImageBlock
        fields = (
            'title',
            'position',
            'url',
        )


class PageJumpsBlockForm(forms.ModelForm):

    class Meta:
        model = PageJumpsBlock
        fields = (
            'title',
            'position',
            'pages',
        )


class StaticBlockForm(forms.ModelForm):

    class Meta:
        model = StaticBlock
        fields = (
            'title',
            'position',
            'name',
        )


class TextBlockForm(forms.ModelForm):

    class Meta:
        model = TextBlock
        fields = (
            'title',
            'position',
            'text',
        )
        widgets = {
            'text': forms.Textarea(
                attrs={
                    'data-wysiwyg': True,
                }
            ),
        }


class VideoBlockForm(forms.ModelForm):

    class Meta:
        model = VideoBlock
        fields = (
            'title',
            'position',
            'url',
        )


class MapBlockForm(forms.ModelForm):

    class Meta:
        model = MapBlock
        fields = (
            'title',
            'position',
            'coordinates',
        )


class ContactForm(forms.Form):
    email = forms.EmailField(label='Email', max_length=255)
    message = forms.CharField(label='Message')
