from django.db import models

from calabria.apps.core.models import Block


class StaticBlock(Block):
    name = models.CharField(max_length=255, verbose_name='Name')

    class Meta:
        db_table = 'core_static_block'
