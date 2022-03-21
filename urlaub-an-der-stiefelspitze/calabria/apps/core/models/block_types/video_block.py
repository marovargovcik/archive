import re
from urllib.parse import urlparse as parse_url, parse_qs

from django.db import models

from calabria.apps.core.models import Block


class VideoBlock(Block):
    url = models.URLField(verbose_name='URL')

    class Meta:
        db_table = 'core_video_block'

    def is_youtube(self):
        url_data = parse_url(self.url)
        return 'youtube' in url_data.netloc

    def is_vimeo(self):
        url_data = parse_url(self.url)
        return 'vimeo' in url_data.netloc

    def get_embed_url(self):
        url_data = parse_url(self.url)
        if self.is_youtube():
            query = parse_qs(url_data.query)
            if 'v' in query:
                return f'//www.youtube.com/embed/{query["v"][0]}?showinfo=0'
        if self.is_vimeo():
            vimeo_id = re.search(r'(\d+)', url_data.path).group(0)
            return f'//player.vimeo.com/video/{vimeo_id}?badge=0&byline=0'
        return None
