from django.db import models

from calabria.apps.core.models import Block


class TextBlock(Block):
    text = models.TextField(verbose_name='Text')

    class Meta:
        db_table = 'core_text_block'
