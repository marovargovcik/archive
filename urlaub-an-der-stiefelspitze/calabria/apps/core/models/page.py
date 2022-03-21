from django.db import models
from django.urls import reverse
from django.utils import translation

from calabria.apps.core.helpers import get_imgur_image
from calabria.apps.core.models.page_translation import PageTranslation


class Page(models.Model):
    name = models.CharField(max_length=255, verbose_name='Name')
    position = models.IntegerField(
        blank=True, default=1, verbose_name='Position')
    is_default_home_page = models.BooleanField(
        default=False, verbose_name='Use page as default home page')
    featured_image = models.URLField(blank=True, verbose_name='Featured image')
    parent_page = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE,
                                    related_name='child_page_set', verbose_name='Parent page')
    is_in_bottom_menu = models.BooleanField(
        default=False, verbose_name='Include in bottom menu')

    class Meta:
        db_table = 'core_page'
        ordering = ('position',)

    def __str__(self):
        return f'Page {self.name}'

    def save(self, *args, **kwargs):
        # Ensure that page with is_default_home_page=True is unique
        if self.is_default_home_page:
            Page.objects.filter(is_default_home_page=True).update(
                is_default_home_page=False)
        super(Page, self).save(*args, **kwargs)

    def get_featured_image(self):
        return get_imgur_image(self.featured_image)

    def get_translations(self):
        return self.page_translation_set.all()

    def get_translation(self, language=None):
        return PageTranslation.objects.filter(language=language or translation.get_language(), page=self).first()

    def get_edit_url(self):
        return reverse('admin_pages_edit', kwargs={
            'pk': self.pk,
        })

    def get_delete_url(self):
        return reverse('admin_pages_delete', kwargs={
            'pk': self.pk,
        })

    @staticmethod
    def get_top_menu_pages():
        return Page.objects.filter(parent_page__isnull=True, is_in_bottom_menu=False)

    @staticmethod
    def get_bottom_menu_pages():
        return Page.objects.filter(is_in_bottom_menu=True)
