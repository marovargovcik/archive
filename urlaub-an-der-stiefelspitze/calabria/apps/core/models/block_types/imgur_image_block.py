from django.db import models

from calabria.apps.core.helpers import get_imgur_image
from calabria.apps.core.models import Block


class ImgurImageBlock(Block):
    url = models.URLField(verbose_name='URL')

    class Meta:
        db_table = 'core_imgur_image_block'

    def get_image(self):
        return get_imgur_image(self.url)
