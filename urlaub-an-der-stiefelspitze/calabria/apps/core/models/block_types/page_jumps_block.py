from django.db import models
from django.utils import translation

from calabria.apps.core.models import Block


class PageJumpsBlock(Block):
    pages = models.ManyToManyField(
        'Page',
        db_table='core_page_jumps_block_pages',
        related_name='+',
        verbose_name='Pages',
    )

    class Meta:
        db_table = 'core_page_jumps_block'

    def get_pages(self):
        return self.pages.filter(page_translation_set__language=translation.get_language())
