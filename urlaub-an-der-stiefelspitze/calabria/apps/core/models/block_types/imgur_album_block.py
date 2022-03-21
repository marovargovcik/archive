from django.db import models

from calabria.apps.core.helpers import get_imgur_album
from calabria.apps.core.models import Block


class ImgurAlbumBlock(Block):
    url = models.URLField(verbose_name='URL')

    class Meta:
        db_table = 'core_imgur_album_block'

    def get_images(self):
        return get_imgur_album(self.url)
