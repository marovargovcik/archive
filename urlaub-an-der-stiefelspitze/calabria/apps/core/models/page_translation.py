from django.db import models
from django.urls import reverse


class PageTranslation(models.Model):
    name = models.CharField(max_length=255, verbose_name='Translated name')
    action_title = models.CharField(
        blank=True, max_length=255, null=True, verbose_name='Action title')
    action_redirect = models.ForeignKey('Page', blank=True, null=True, on_delete=models.SET_NULL, related_name='+',
                                        verbose_name='Action redirect')
    language = models.CharField(max_length=2, verbose_name='Language')
    url = models.CharField(max_length=255, verbose_name='URL')
    page = models.ForeignKey(
        'Page', on_delete=models.CASCADE, related_name='page_translation_set')
    description = models.TextField(
        blank=True, verbose_name='Translated description')

    class Meta:
        db_table = 'core_page_translation'
        unique_together = (
            ('language', 'page',),
            ('language', 'url',),
        )

    def __str__(self):
        return f'Translation ({self.language}) of page id {self.page.id}'

    def get_url(self):
        if self.page.is_default_home_page:
            return f'/{self.language}/'
        return f'/{self.language}/{self.url}/'

    def get_edit_url(self):
        return reverse('admin_page_translations_edit', kwargs={
            'language': self.language,
            'pk': self.page.pk,
        })

    def get_delete_url(self):
        return reverse('admin_page_translations_delete', kwargs={
            'pk': self.page.pk,
            'language': self.language,
        })
