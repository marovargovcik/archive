from django.db import models

from calabria.apps.core.models import Block


class MapBlock(Block):
    coordinates = models.CharField(max_length=255, verbose_name='Coordinates')

    class Meta:
        db_table = 'core_map_block'
